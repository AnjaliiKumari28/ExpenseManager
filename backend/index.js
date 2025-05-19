import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { db } from './firebaseAdmin.js';

const financesCollection = db.collection('finances');
const usersCollection = db.collection('users');
const app = express();

// Middleware to authenticate and decode Firebase access token
const authenticateFirebaseToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'No token provided' });
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: 'Unauthorized' });
    }
};

app.use(cors());
app.use(express.json());

app.get('/all-finances', authenticateFirebaseToken, async (req, res) => {
    const { duration } = req.query;
    const email = req.user.email;
    let startDate;
    let order = 'desc'

    const now = new Date();

    switch (duration) {
        case '15days':
            startDate = admin.firestore.Timestamp.fromDate(new Date(now.setDate(now.getDate() - 15)));
            break;
        case '1month':
            startDate = admin.firestore.Timestamp.fromDate(new Date(now.setMonth(now.getMonth() - 1)));
            break;
        case '3month':
            startDate = admin.firestore.Timestamp.fromDate(new Date(now.setMonth(now.getMonth() - 3)));
            break;
        case '6month':
            startDate = admin.firestore.Timestamp.fromDate(new Date(now.setMonth(now.getMonth() - 6)));
            break;
        case '1year':
            startDate = admin.firestore.Timestamp.fromDate(new Date(now.setFullYear(now.getFullYear() - 1)));
            break;
        case 'currentMonth':
            startDate = admin.firestore.Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), 1));
            order = 'asc'
            break;
        default:
            startDate = null;
            break;
    }

    try {
        let snapshot;

        if (startDate) {
            snapshot = await financesCollection
                .where('email', '==', email)
                .where('transactionDate', '>=', startDate)
                .orderBy('transactionDate', order)
                .get();
        } else {
            snapshot = await financesCollection
                .where('email', '==', email)
                .get();
        }

        const finances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json({ data: finances });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving finances: ' + error.message });
    }
});


app.get('/monthly-finances', authenticateFirebaseToken, async (req, res) => {
    const { month, year } = req.query;
    const email = req.user.email;

    // Convert month name to month index (0 for January, 11 for December)
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = monthNames.indexOf(month);
    
    if (monthIndex === -1) {
        return res.status(400).json({ message: 'Invalid month name' });
    }

    // Define the start and end date of the month
    const startDate = admin.firestore.Timestamp.fromDate(new Date(year, monthIndex, 1, 0, 0, 0, 0));
    const endDate = admin.firestore.Timestamp.fromDate(new Date(year, monthIndex + 1, 0, 23, 59, 59, 999));

    try {
        let snapshot;

        if (startDate && endDate) {
            snapshot = await financesCollection
                .where('email', '==', email)
                .where('transactionDate', '>=', startDate)
                .where('transactionDate', '<=', endDate)
                .orderBy('transactionDate', 'asc')
                .get();
        }

        const finances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json({ data: finances });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving finances: ' + error.message });
    }
});

app.post('/add-expense', authenticateFirebaseToken, async (req, res) => {
    const { expenseAmount, expenseSource, expenseMethod, date } = req.body;
    const email = req.user.email;  // Email from Firebase token

    try {
        // Step 1: Fetch the latest transaction for the user by email, ordered by date descending
        const userDoc = await usersCollection.where('email', '==', email).limit(1).get();

        // Step 2: Check if a previous transaction exists
        if (userDoc.empty) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userRef = userDoc.docs[0].ref;
        const currentBalance = userDoc.docs[0].data().balance || 0;

        // Step 3: Calculate the new balance by subtracting the expense amount from the previous balance
        const newBalance = currentBalance - expenseAmount;

        // Step 4: Prepare the finance data to be added
        const financeData = {
            email,
            expenseAmount,
            expenseSource,
            expenseMethod,
            transactionDate: admin.firestore.Timestamp.fromDate(new Date(date)),
        };

        // Step 5: Add the new expense to the finances collection
        await financesCollection.add(financeData);
        await userRef.update({ ['balance']: (newBalance) });
        res.status(200).json({ message: "Success" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating finance record: ' + error.message });
    }
});

// Add income with balance calculation
app.post('/add-income', authenticateFirebaseToken, async (req, res) => {
    const { incomeAmount, incomeSource, incomeMethod, date } = req.body;
    const email = req.user.email;  // Email from Firebase token

    try {
        // Step 1: Fetch the latest transaction for the user by email, ordered by date descending
        const userDoc = await usersCollection.where('email', '==', email).limit(1).get();

        // Step 2: Check if a previous transaction exists
        if (userDoc.empty) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userRef = userDoc.docs[0].ref;
        const currentBalance = userDoc.docs[0].data().balance || 0;
        
        // Step 3: Calculate the new balance by adding the income amount to the previous balance
        const newBalance = currentBalance + incomeAmount;

        // Step 4: Prepare the finance data to be added
        const financeData = {
            email,
            incomeAmount,
            incomeSource,
            incomeMethod,
            transactionDate: admin.firestore.Timestamp.fromDate(new Date(date)),
        };

        // Step 5: Add the new income to the finances collection
        await financesCollection.add(financeData);
        await userRef.update({ ['balance']: (newBalance) });
        res.status(200).json({ message: "Success" });

    } catch (error) {
        console.log(error)
        res.status(500).send('Error creating finance record: ' + error.message);
    }
});

app.get('/choices', authenticateFirebaseToken, async (req, res) => {
    const email = req.user.email;
    try {
        const snapshot = await usersCollection
            .where('email', '==', email)
            .limit(1)
            .get()

        if (snapshot.empty) return res.status(400).json({ message: "No Data" })

        const choices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json({ data: choices[0] })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "An error occcured" })
    }
})

app.patch('/update-choice', authenticateFirebaseToken, async (req, res) => {
    const email = req.user.email;
    const { field, value } = req.body;

    if (!field || !value) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        const userDoc = await usersCollection.where('email', '==', email).limit(1).get();

        if (userDoc.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userRef = userDoc.docs[0].ref;
        await userRef.update({ [field]: JSON.stringify(value) });

        res.status(200).json({ message: 'Field updated successfully' });
    } catch (error) {
        console.error('Error updating choice:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.listen(3000, () => {
    console.log("Server is running");
});

