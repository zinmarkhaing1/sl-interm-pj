
import { Avatar, Box, Button, Card, CardContent, Divider, Stack, TextField, Typography } from '@mui/material'
export const ProfilePage = () => {
    
  return (
    <Box sx={{minHeight:'100vh',bgcolor:'#f4f6f8',display:'flex',justifyContent: 'center',alignItems:'center',p:3,}}>
        <Card sx={{width:450,borderRadius:4, boxShadow:4}}>
            <CardContent>
                <Stack spacing={2} sx={{mb:3,display:'flex',justifyContent:'center',alignItems:'center'}}>
                    < Avatar src="https://i.pravatar.cc/300" sx={{width:100,height:100,}}/>
                    <Typography variant='h5' sx={{fontWeight:'bold'}}>Martin Eward</Typography>
                    <Typography color="text.secondary">Frontend Developer</Typography>
                    <Button variant='contained' sx={{width:200,p:1,borderRadius:2}}>Change Photo</Button>
                </Stack>
                < Divider sx={{mb:3}}/>
                <Stack spacing={3}>
                    <TextField label="full Name" fullWidth defaultValue="Martin Eward"/>
                    <TextField label="Email" fullWidth defaultValue="martineward@gmail.com"/>
                    <TextField label="bio" multiline rows={3} fullWidth defaultValue="I love building moder ui with React and MUI."/>
                    <Button variant='contained' size='medium' sx={{p:1,borderRadius:2}} >
                        Save Changes
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    </Box>
  )
}
