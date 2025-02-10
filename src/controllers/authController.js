// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user.model');
// const { roles, permissions,rolePermissions } = require('../models/user.model'); // Correct Import
// const { v4: uuidv4 } = require('uuid');

// // Helper function to generate JWT token
// const generateToken = (user) => {
//     return jwt.sign(
//         {
//             user_id: user.user_id,
//             email: user.email,
//             name: user.name,
//             role: user.role,
//             status: user.status,
//             permissions: user.permissions,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//     );
// };
// // Signup Controller
// const signup = async (req, res) => {
//     try {
//         const { email, name, password, role } = req.body;
//         console.log('Password received for signup:', password);

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'User already exists' });
//         }

//         // Hash the password

//         // Create new user
//         const newUser = new User({
//             user_id: uuidv4(),
//             email,
//             name,
//             password,
//             role: role || roles.STUDENT, // Default to 'STUDENT' role
//             permissions: rolePermissions[role] || rolePermissions[roles.STUDENT]});

//         await newUser.save();
//         return res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Error registering user:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Login Controller
// const signin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log('Signin attempt for:', email);

//         // Check if the user exists
//         const user = await User.findOne({ email });
//         if (!user || !user.password) {
//             console.log('User not found or password missing:', email);
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         // console.log('Stored Hashed Password:', user.password);
//         console.log('Entered Password:', password);

//         // Verify password
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         // console.log('Password Match Result:', isPasswordValid);

//         if (!isPasswordValid) {
//             console.log('Invalid password attempt for user:', email);
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         // Generate JWT token and send response
//         const token = generateToken(user);
//         return res.json({ message: 'Login successful', token });
//     } catch (error) {
//         console.error('Error during login:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Get User Profile Controller
// const getProfile = (req, res) => {
//     return res.json({ user: req.user });
// };

// // Create Meeting Controller
// const createMeeting = (req, res) => {
//     return res.json({ message: 'Meeting created successfully' });
// };

// module.exports = {
//     signup,
//     signin,
//     getProfile,
//     createMeeting
// };
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { roles, permissions, rolePermissions } = require('../models/user.model'); // Correct Import
const { v4: uuidv4 } = require('uuid');

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            permissions: user.permissions,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Signup Controller
const signup = async (req, res) => {
    try {
        const { email, name, password, role } = req.body;
        console.log('Password received for signup:', password);
        console.log('Role received for signup:', role);  // Debugging log

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Normalize role to an array (Handle both string and array input)
        const assignedRoles = role 
            ? (Array.isArray(role) ? role : [role]) 
            : [roles.STUDENT]; 

        console.log('Assigned Roles:', assignedRoles); // Debugging log

        // Determine permissions based on roles
        const userPermissions = new Set();
        assignedRoles.forEach(r => {
            (rolePermissions[r] || []).forEach(permission => userPermissions.add(permission));
        });

        // Create new user
        const newUser = new User({
            user_id: uuidv4(),
            email,
            name,
            password,
            role: assignedRoles, 
            permissions: Array.from(userPermissions) // Convert Set to Array
        });

        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// Login Controller
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Signin attempt for:', email);

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            console.log('User not found or password missing:', email);
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('Entered Password:', password);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid password attempt for user:', email);
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token and send response
        const token = generateToken(user);
        return res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get User Profile Controller
const getProfile = (req, res) => {
    return res.json({ user: req.user });
};

// Create Meeting Controller
const createMeeting = (req, res) => {
    return res.json({ message: 'Meeting created successfully' });
};

module.exports = {
    signup,
    signin,
    getProfile,
    createMeeting
};
