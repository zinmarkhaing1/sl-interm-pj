// Simple script to simulate invite -> accept -> view -> notifications
// Run with: node ./scripts/simulate-invite.js

const BASE = process.env.BASE_URL || 'http://localhost:5000/api';
const fetch = global.fetch || require('node-fetch');

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  let json = null;
  try { json = await res.json(); } catch(e) { json = null; }
  return { status: res.status, body: json };
}

async function upsertUser({email, password, firstName, lastName}) {
  const signup = await request('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  if (signup.status === 201 && signup.body?.data?.token) {
    return { token: signup.body.data.token, user: signup.body.data.auth || signup.body.data.user };
  }

  // try login if signup failed (user exists)
  const login = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (login.status === 201 && login.body?.data?.token) {
    return { token: login.body.data.token, user: login.body.data.user };
  }

  throw new Error(`Unable to create/login user ${email}: ${JSON.stringify(signup.body || login.body)}`);
}

async function main(){
  try {
    console.log('Creating inviter...');
    const inviterEmail = 'inviter@example.com';
    const inviteeEmail = 'invitee@example.com';
    const inviter = await upsertUser({ email: inviterEmail, password: 'Pass1234', firstName: 'Inviter', lastName: 'One' });
    console.log('Inviter token length:', (inviter.token || '').length);

    // create a note for inviter
    const createNote = await request('/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${inviter.token}` },
      body: JSON.stringify({ title: 'Invitation test note', content: 'This note is created for invite test.' }),
    });
    const noteId = createNote.body?._id || createNote.body?.id;
    console.log('Created note id:', noteId);

    // invite the invitee
    console.log('Sending invitation...');
    const inviteRes = await request('/share/multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${inviter.token}` },
      body: JSON.stringify({ emails: [inviteeEmail], pageUrl: `http://localhost:5174/notes/${noteId}` }),
    });
    console.log('Invite response status:', inviteRes.status);

    // sign up invitee (accepts pending invites)
    console.log('Creating/Logging invitee...');
    const invitee = await upsertUser({ email: inviteeEmail, password: 'Pass1234', firstName: 'Invitee', lastName: 'Two' });
    console.log('Invitee token len:', (invitee.token || '').length);

    // invitee views the note to trigger owner notification
    if (noteId) {
      console.log('Invitee viewing the note to trigger notification...');
      await request(`/notes/${noteId}`, { method: 'GET', headers: { Authorization: `Bearer ${invitee.token}` } });
    }

    // fetch notifications for inviter
    const inviterNotifs = await request('/notifications', { headers: { Authorization: `Bearer ${inviter.token}` } });
    console.log('Inviter notifications:', JSON.stringify(inviterNotifs.body?.notifications || inviterNotifs.body, null, 2));

    // fetch notifications for invitee
    const inviteeNotifs = await request('/notifications', { headers: { Authorization: `Bearer ${invitee.token}` } });
    console.log('Invitee notifications:', JSON.stringify(inviteeNotifs.body?.notifications || inviteeNotifs.body, null, 2));

    console.log('Simulation complete');
  } catch (err) {
    console.error('Simulation failed:', err);
  }
}

main();
