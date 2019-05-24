const express = require('express');
const router = new express.Router();
var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cell-solar.firebaseio.com"
});

const db=admin.firestore();

router.post('/customers', async (request, response) => {
    try {
      const { first_name, last_name, email,mobileno } = request.body;
      const data = {
        first_name,
        last_name,
        email,
        mobileno
      } 
      const customerRef = await db.collection('customers').add(data);
      const customer = await customerRef.get();
  
      response.json({
        id: customerRef.id,
        data: customer.data()
      });
  
    } catch(error){
  
      response.status(500).send(error);
  
    }
  });

  router.get('/customers', async (request, response) => {
    try {
  
      const customerQuerySnapshot = await db.collection('customers').get();
      const customers = [];
      customerQuerySnapshot.forEach(
          (doc) => {
            customers.push({
                  id: doc.id,
                  data: doc.data()
              });
          }
      );
  
      response.json(customers);
  
    } catch(error){
  
      response.status(500).send(error);
  
    }
  
  });

  router.get('/customers/:id', async (request, response) => {
    try {
      const customerId = request.params.id;
  
      if (!customerId) throw new Error('Customer ID is required');
  
      const customer = await db.collection('customers').doc(customerId).get();
  
      if (!customer.exists){
          throw new Error('customer doesnt exist.')
      }
  
      response.json({
        id: customer.id,
        data: customer.data()
      });
  
    } catch(error){
  
      response.status(500).send(error);
  
    }
  });

  module.exports = router;