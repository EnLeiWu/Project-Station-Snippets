const usersService = require("../services/users.service");
const faker = require('faker');

module.exports = {
  userGenerater: userGenerater
}

//using faker library to generate 8 users upon api call
//services and api definition are seperated into different files for seperation of concern and code reusability

function userGenerater(req, res) {
  const userArray = [];
  for (let i = 0; i < 5; i++) {
    const board = {
      notificationOptions: {
        email: true,
        website: true,
        sms: true
      },
      imageUploadUrl: "http://media.graytvinc.com/images/810*455/harambe+cincinnati+zoo+gorilla.jpg",
      phoneNumber: faker.phone.phoneNumber(),
      departmentId: "5b39776640eeeb03bd254b00",
      email: faker.internet.email(),
      approvalStatus: "Approved",
      createDate: new Date(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: hasher.hashString("111111"),
      isBoardMember: true,
      isItAdmin: false,
      isProjectManager: false,
      title: faker.name.title()
    }
    userArray.push(board)
  }
  const admin = {
    notificationOptions: {
      email: true,
      website: true,
      sms: true
    },
    imageUploadUrl: "http://media.graytvinc.com/images/810*455/harambe+cincinnati+zoo+gorilla.jpg",
    phoneNumber: faker.phone.phoneNumber(),
    departmentId: "5b39776640eeeb03bd254b00",
    email: faker.internet.email(),
    approvalStatus: "Approved",
    createDate: new Date(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: hasher.hashString("111111"),
    iisBoardMember: false,
    isItAdmin: true,
    isProjectManager: false,
    title: faker.name.title()
  }
  const projectManager = {
    notificationOptions: {
      email: true,
      website: true,
      sms: true
    },
    imageUploadUrl: "http://media.graytvinc.com/images/810*455/harambe+cincinnati+zoo+gorilla.jpg",
    phoneNumber: faker.phone.phoneNumber(),
    departmentId: "5b39776640eeeb03bd254b00",
    email: faker.internet.email(),
    approvalStatus: "Approved",
    createDate: new Date(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: hasher.hashString("111111"),
    isBoardMember: false,
    isItAdmin: false,
    isProjectManager: true,
    title: faker.name.title()
  }
  const regualrUser = {
    notificationOptions: {
      email: true,
      website: true,
      sms: true
    },
    imageUploadUrl: "http://media.graytvinc.com/images/810*455/harambe+cincinnati+zoo+gorilla.jpg",
    phoneNumber: faker.phone.phoneNumber(),
    departmentId: "5b39776640eeeb03bd254b00",
    email: faker.internet.email(),
    approvalStatus: "Approved",
    createDate: new Date(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    isBoardMember: false,
    isItAdmin: false,
    isProjectManager: false,
    password: hasher.hashString("111111"),
    title: faker.name.title()
  }
  userArray.push(admin, projectManager, regualrUser)
  usersService.userGenerater(userArray)
    .then(response => {
      res.send(response)
    })
    .catch(error => {
      res.send(erorr)
    })
}
