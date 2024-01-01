import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // adjust the import path if needed
import { Container, Box, TextField, Button, Typography, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  state: string;
  country: string;
  zip: string;
}

const defaultTheme = createTheme();

const UserAcct = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
          setEditUser(userData);
        }
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditUser(prevState => ({ ...prevState, [name]: value || "" }));
  };

  const handleUserUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userId && editUser) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { ...editUser });
      setUser(editUser);
      alert('User information updated!');
    }
  };

  if (!user || !editUser) {
    return <div>
      <h1>Please Login to view or update account information</h1>
    </div>;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "tan" }}>
            <StoreRoundedIcon sx={{ color: "black" }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            User Information
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleUserUpdate}
            sx={{ mt: 3 }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              autoFocus
              value={editUser.firstName}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={editUser.lastName}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              value={editUser.address}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="state"
              label="State"
              name="state"
              autoComplete="state"
              value={editUser.state}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="country"
              label="Country"
              name="country"
              autoComplete="country"
              value={editUser.country}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="zip"
              label="Zip"
              name="zip"
              autoComplete="zip"
              value={editUser.zip}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Information
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UserAcct;