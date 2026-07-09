/* Integration test for invite flow. Requires backend running and Mongo configured. */
jest.setTimeout(30000);
const { exec } = require('child_process');

test('simulate invite flow script runs without error', (done) => {
  exec('node ./scripts/simulate-invite.js', { cwd: __dirname + '/..' }, (err, stdout, stderr) => {
    if (err) {
      done(err);
      return;
    }
    // basic assertion: output includes 'Simulation complete'
    if (stdout && stdout.indexOf('Simulation complete') !== -1) {
      done();
    } else {
      done(new Error('Simulation did not complete. stdout: ' + stdout + '\nstderr: ' + stderr));
    }
  });
});
