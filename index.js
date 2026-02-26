// const express = require('express');
// const app = express();
// const apiLogin = require('./routes/apiLogin');
// const apiServices = require('./routes/apiServices');
// const apiSubmission = require('./routes/apiSubmission');
// const apiForm = require('./routes/apiForm');
// const apiRole = require('./routes/apiRole');
// const apiUser = require('./routes/apiUser');
// const apiMasters = require('./routes/apiMasters');
// const bcrypt = require('bcrypt');
// const router = express.Router();
// const verifyToken = require('./middleware/verifyToken');
// const cors = require('cors');
// const path = require('path');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
// const { createApplicationPDF } = require('./routes/generatePDF');
// const apiCertificate = require('./routes/apiCertificate');
// const paymentRoutes = require('./routes/payment');

// const apiAllMasterFunctions = require('./routes/apiAllMasterFunctions');

// const apiMailHandler = require('./routes/apiMailHandler');

// const feeDefRoutes = require('./routes/admin/fee-definitions');
// const invoiceGenerate = require('./routes/admin/generate-invoice');

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();


// const apiCreateTable = require('./routes/apiCreateTable');

// const apiMasterMapping = require('./routes/apiMasterMapping');
// const verifyTokenOptional = require('./middleware/verifyTokenOptional');



// app.use(cors());

// app.use(express.urlencoded({ extended: true }));

// app.use(express.json());

// app.use('/api', apiCreateTable);

// app.use('/api', apiAllMasterFunctions);

// app.use('/api/payment', paymentRoutes);

// app.use("/api/admin/fee-definitions", feeDefRoutes);
// app.use("/api/admin", invoiceGenerate);


// // app.use('/api/apiMasterMapping', apiMasterMapping);





// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/login', apiLogin);
// app.use('/api', apiUser);





// // ============handle master========

// app.get('/api/available-masters', (req, res) => {
//   const data = [
//     {
//       name: 'Country Master',
//       apiUrl: "api/country-master",
//     },
//     {
//       name: 'State Master',
//       apiUrl: "api/state-master",
//     }
//   ]


//   return res.status(200).json({
//     status: 200,
//     message: 'success',
//     data: data
//   });
// });

// app.get('/api/country-master', (req, res) => {
//   const data = [
//     { id: 1, name: 'Afghanistan' },
//     { id: 101, name: 'India' }
//   ]

//   return res.status(200).json({
//     status: 200,
//     message: 'success',
//     data: data
//   });
// });


// app.get('/api/state-master', (req, res) => {
//   const data = [
//     { id: 1, name: 'bhopal' },
//     { id: 101, name: 'Indore' }
//   ]

//   return res.status(200).json({
//     status: 200,
//     message: 'success',
//     data: data
//   });
// });

// // ============handle master========


// // app.get('/api/application/pdf', (req, res) => {

// //   const data = {
// //     "name": "Pankaj",
// //     "gender": "{\"id\":1747057211748,\"name\":\"Male\"}",
// //     "repeaters": "{\"director\":[{\"name\":\"Director 1\",\"qualification\":{\"id\":1747057263514,\"name\":\"10th\"},\"age\":45,\"fatherName\":\"Ramesh Kumar\"},{\"name\":\"Director 2\",\"qualification\":{\"id\":1747057263292,\"name\":\"Post Graduation\"},\"age\":38,\"fatherName\":\"Suresh Das\"}]}"
// //   };
// //   // set headers so browser knows it’s a PDF attachment
// //   res.setHeader('Content-Type', 'application/pdf');
// //   res.setHeader(
// //     'Content-Disposition',
// //     'attachment; filename="application_form.pdf"'
// //   );

// //   // call your PDF generator, piping into `res`
// //   createApplicationPDF(data, res);
// //   // no need to call res.end() — createApplicationPDF ends the stream
// // });











// app.get('/api/get-state', async (req, res) => {
//   try {
//     const { value } = req.query;

//     if (value === 'test-api') {
//       return res.status(200).json({
//         status: 200,
//         message: 'success',
//         data: {
//           name: "Test",
//           state: "Test"
//         }
//       })
//     }

//     if (!value) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Missing country ID (value)',
//       });
//     }

//     const states = await prisma.state.findMany({
//       where: {
//         country_id: parseInt(value),
//       },
//       select: {
//         id: true,
//         name: true,
//       },
//     });

//     return res.status(200).json({
//       status: 200,
//       message: 'success',
//       data: {
//         name: "Pankaj",
//         state: states.map((state) => ({
//           id: state.id.toString(), // Optional: convert to string for frontend
//           name: state.name,
//         })),
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching states:', error);
//     return res.status(500).json({
//       status: 500,
//       message: 'Internal Server Error',
//     });
//   }
// });


// app.get('/api/get-city', async (req, res) => {
//   try {
//     const { value } = req.query;

//     if (value === 'test-api') {
//       return res.status(200).json({
//         status: 200,
//         message: 'success',
//         data: {
//           city: "Test"
//         }
//       })
//     }

//     if (!value) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Missing state ID (value)',
//       });
//     }

//     const cities = await prisma.city.findMany({
//       where: {
//         state_id: parseInt(value),
//       },
//       select: {
//         id: true,
//         name: true,
//       },
//     });

//     return res.status(200).json({
//       status: 200,
//       message: 'success',
//       data: {
//         city: cities.map((city) => ({
//           id: city.id.toString(), // Optional: convert to string for frontend
//           name: city.name,
//         })),
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching cities:', error);
//     return res.status(500).json({
//       status: 500,
//       message: 'Internal Server Error',
//     });
//   }
// });
// app.use('/api/submissions', verifyTokenOptional, apiSubmission);
// app.use('/api', verifyTokenOptional, apiForm);
// app.use('/api', verifyTokenOptional, apiSubmission);

// app.use('/api', verifyToken, apiServices);


// app.use('/api', verifyToken, apiMailHandler);

// app.use('/api', verifyToken, apiRole);

// app.use('/api', verifyToken, apiMasters);

// app.use('/api', verifyToken, apiCertificate);

// // const swaggerOptions = {
// //   definition: {
// //     openapi: '3.0.0',
// //     info: {
// //       title: 'API Documentation',
// //       version: '1.0.0',
// //       description: 'This is the API documentation for your backend',
// //     },
// //     servers: [
// //       {
// //         url: 'http://localhost:3001',
// //       },
// //     ],
// //     components: {
// //       securitySchemes: {
// //         bearerAuth: {
// //           type: 'http',
// //           scheme: 'bearer',
// //           bearerFormat: 'JWT'
// //         }
// //       }

// //     },
// //     security: [
// //       {
// //         bearerAuth: []
// //       }
// //     ]
// //   },
// //   apis: ['./routes/*.js'], // Path to your route files
// // };

// // const swaggerDocs = swaggerJsdoc(swaggerOptions);
// // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// app.listen(3001, () => console.log('Server is running on port 3001'));


const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const verifyToken = require('./middleware/verifyToken');
const verifyTokenOptional = require('./middleware/verifyTokenOptional');
const multer = require('multer');
const session = require('express-session');

const app = express();
const prisma = new PrismaClient();

// Middlewares

app.use(cors({
  origin: process.env.BASE_URL_NEXT || "http://localhost:3000",
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
  🔥 SESSION CONFIGURATION
  30 minutes inactivity timeout
  rolling: true = extend expiry on every request
*/
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || "super_secret_key",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: 'Lax',
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/authorization', require('./routes/authorization'));
app.use('/api/login', require('./routes/apiLogin'));
app.use('/api', require('./routes/apiUser'));
app.use('/api', require('./routes/apiCreateTable'));
app.use('/api', require('./routes/apiAllMasterFunctions'));
app.use('/api/payment', require('./routes/payment'));
app.use("/api/admin/fee-definitions", require('./routes/admin/fee-definitions'));
app.use('/api/whatsapp', require('./routes/apiWhatsappRoutes'));
app.use('/api/whatsappnew', require('./routes/apiWhatsAppNew'));

app.use("/api/admin", verifyToken, require('./routes/admin/generate-invoice'));

app.use('/api', verifyToken, require('./routes/apiSubmission'));
app.use('/api/submissions', verifyToken, require('./routes/apiSubmission'));
app.use('/api', verifyToken, require('./routes/apiForm'));

app.use('/api', verifyToken, require('./routes/apiServices'));
app.use('/api', verifyToken, require('./routes/apiMailHandler'));
app.use('/api', verifyToken, require('./routes/apiBoForms'));
app.use('/api', verifyToken, require('./routes/apiRole'));
app.use('/api', verifyToken, require('./routes/apiMasters'));
app.use('/api', verifyToken, require('./routes/apiCertificate'));
app.use('/api', verifyToken, require('./routes/apiMarketStats'));
app.use('/api', verifyToken, require('./routes/apiApplicationMaster'));
app.use('/api', verifyToken, require('./routes/apiCommunityHall'));

app.use('/api', verifyToken, require('./routes/apiWardZoneColony'));
app.use('/api', verifyToken, require('./routes/apiApplicationSearch'));
app.use('/api', verifyToken, require('./routes/apiCommonFunctions'));

app.use('/api', verifyToken, require('./routes/cashdesk/apiApplicationDetails'));
// app.use('/api/rental', verifyToken, require('./routes/cashdesk/apiRentalPayments'));
app.use('/api/cashdesk', verifyToken, require('./routes/cashdesk/apiChequePayments'));

app.use('/api', verifyToken, require('./routes/demandModification'));
app.use('/api/rental', verifyToken, require('./routes/cashdesk/apiBilling'));
app.use('/api/common', verifyToken, require('./routes/cashdesk/apiCollectCommonPayemnt'));

app.use('/api/rental', verifyToken, require('./routes/cashdesk/generate/bill'));

app.use('/api', verifyToken, require('./routes/apiSmsRoutes'));

app.use('/api', verifyToken, require('./routes/apiRentalSearchBills'));

app.use('/api', verifyToken, require('./routes/apiLedger'));

app.use('/api', verifyToken, require('./routes/apiMarriageFunction'));

app.use('/api', verifyToken, require('./routes/apiReceipts'));


app.use('/api', verifyToken, require('./routes/apiNOC'));

app.use('/api/masters', require('./routes/apiDepartmentMaster'));
app.use('/api/masters', require('./routes/apiDriverMaster'));
app.use('/api/masters', require('./routes/apiVehicleMaster'));
app.use('/api/', require('./routes/apiUserDepartmentMapping'));
// Master routes
app.use('/api/masters', require('./routes/mastersRoutes')(prisma));
app.use('/api/paymentTransaction', verifyToken, require('./routes/paymentTransaction'));
app.use("/api/securitydeposit", verifyToken, require("./routes/securitydeposit"));
app.use("/api/defaulterReport", verifyToken, require("./routes/defaulterReport"));
app.use("/api/namantran", verifyToken, require("./routes/namantran"));
app.use("/api/freezeRentalReport", verifyToken, require("./routes/freezeRentalReport"));
app.use("/api/demandCollectionReport", verifyToken, require("./routes/demandCollectionReport"));
app.use("/api/marketWiseCollectionReport", verifyToken, require("./routes/marketWiseCollectionReport"));
app.use("/api/gstReport", verifyToken, require("./routes/gstReport"));
app.use("/api/wardZoneCollectionReport", verifyToken, require("./routes/wardZoneCollectionReport"));
app.use("/api/accountantCollectionReport", verifyToken, require("./routes/accountantCollectionReport"));
app.use("/api/onlineCollectionReport", verifyToken, require("./routes/onlineCollectionReport"));
app.use("/api/contractRenewalReport", verifyToken, require("./routes/contractRenewalReport"));
app.use("/api/transactionCollectionReport", verifyToken, require("./routes/transactionCollectionReport"));
app.use("/api/shopsReport", verifyToken, require("./routes/shopsReport"));
app.use("/api/rental/rates", verifyToken, require("./routes/apiRentalRates"));


app.use('/api', verifyToken, require('./routes/apiUsersByRole'));

app.use('/api', verifyToken, require('./routes/apiDayClosure'));


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "File too large (max 2 MB)" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Invalid file type (only images/docs allowed)" });
    }
    return res.status(400).json({ message: err.message });
  }
  // agar koi aur error hai
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

app.listen(3001, () => console.log('Server running on port 3001'));
