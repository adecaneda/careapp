
// API explained
The API has 3 entities: caregivers, customers and services.

The data structure is following:
- Caregiver: name + surname + gender + 
- Customer: name + surname + gender + birth_date + services
- Service: name + type


// ---------------------------------
// SERVICES
// Lists all services
GET api/services

// Lists all services of a given type
GET api/services ? type=[TYPE]

// Show one service
GET api/services/:serviceId

// Modify one service
PUT api/services/:serviceId

// Creates one service
POST api/services


// ---------------------------------
// CAREGIVERS
// Lists all caregivers
GET api/caregivers

// Show one caregiver
GET api/caregivers/:caregiverId

// Modify one caregiver
PUT api/caregivers/:caregiverId

// Creates one caregiver
POST api/caregivers



// ---------------------------------
// CUSTOMERS
// Lists all customers
GET api/customers

// Show one customer
GET api/customers/:customerId

// Modify one customer
PUT api/customers/:customerId

// Creates one customer
POST api/customers

// Adds a service to one customer
POST api/customers/:customerId/addService ? serviceId=[ID]

// Removes a service from one customer
POST api/customers/:customerId/addService ? serviceId=[ID]
