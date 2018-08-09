const projectRequestPartThreeService = require('../services/projectRequestPartThree.service')
const emailService = require('../services/email.service')
const usersService = require('../services/users.service')
const notificationsService = require('../services/notifications.service')
const webSocket = require('../websocket')

module.exports = {
  create: create
}


//using sendgrid to send email and websocket to send real-time notifications upon creation of a project request
//all services are separated into individual files to be reusalbe

function create(req, res) {
    projectRequestPartThreeService.create(req.model)
        .then(response => {
            return usersService.readItAdmins()
        })
        .then(itAdmins => {
            const emailsOn = itAdmins.filter(admin => admin.notificationOptions && admin.notificationOptions.email === true)
            const emails = emailsOn.map(item => item.email)
            const submitMailContent = '<div style={{ "color": "white", "background-color": "#4d94ff", "margin": "0px" }}><div id="horizon" style={{ "background-color": "transparent", "text-align": "center", "position": "absolute", "top": "15%", "width": "100%", "height": "1px", "overflow": "visible", "visibility": "visible", "display": "block" }}><div id="content" style={{ "font-family": "Verdana, Geneva, Arial, sans-serif", "background-color": "transparent", "margin-left": "-125px", "position": "absolute", "top": "15%", "left": "50%", "width": "250px", "height": "70px", "visibility": "visible" }}><div class="bodytext" style={{ "font-size": "14px" }}><span class="headline" style={{ "font-weight": "bold", "font-size": "24px", "text-shadow": "3px 2px #000000" }}>PROJECT STATION - ' + date + '</span><p>Your request has been successfully submitted!</p><p>Please do not reply to this email as this inbox is not monitored. If you feel you have received this message in error, plese disregard this email or you may:</p><p><a href=" http://localhost:3000/contact-form" target="_blank">Contact Us Here.</a></p><p>From,</p><p>The Project Station Team</p></div></div></div><div id="footer" style={{ "font-size": "11px", "font-family": "Verdana, Geneva, Arial, sans-serif", "text-align": "center", "position": "absolute", "bottom": "0px", "left": "0px", "width": "100%", "height": "20px", "visibility": "visible", "display": "block" }}><a href="http://localhost:3000/" target="_blank">Project Station Home</a></div></div>'
            const submitMailSubject = 'Request Submitted!'
            const notificationsOn = itAdmins.filter(admin => admin.notificationOptions && admin.notificationOptions.website === true)
            notificationsOn.forEach(item => {
                const notification = {
                    title: req.model.projectName
                    , isRead: false
                    , notificationType: "application"
                    , status: req.model.status
                    , userId: item._id
                }
                notificationsService.create(notification)
                if (webSocket.clients[item._id] && webSocket.clients[item._id].readyState === webSocket.clients[item._id].OPEN) {
                    webSocket.clients[item._id].send(JSON.stringify(notification))
                }
            })
            emailService.sendEmail(emails, submitMailContent, submitMailSubject)
            res.send(itAdmins)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}
