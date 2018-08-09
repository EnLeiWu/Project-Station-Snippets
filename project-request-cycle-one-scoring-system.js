const evalAndRankService = require('../services/evalAndRank.service');
const projectRequestPartThreeService = require('../services/projectRequestPartThree.service');
const notificationsService = require('../services/notifications.service');
const webSocket = require('../websocket')
const usersService = require("../services/users.service")

module.exports = {
  updateCycleOne: updateCycleOne
}

//upon evaluation submitted by board members, the following function will check if all board members have submitted an evaluation. If so, the scoring process for cycle one will begin and return an decision outcome.

function updateCycleOne(req, res) {
    let outcome;
    evalAndRankService
        .readByProposalAndEvaluator(req.params.id, req.auth.id)
        .then(data => {
            return evalAndRankService.update(data._id, req.model)
        })
        .then(() => {
            return Promise.all([getBoardMembersCount(), evalAndRankService.getEvalsByProposalId(req.params.id)])
        })
        .then(values => {
            if (values[0] === values[1].length) {
                return values[1]
            } else {
                res.send('waiting for other Boardmembers')
            }
            throw 'whoops'
        })
        .then(data => {
            let valueTotal = 0;
            let successTotal = 0;
            let scalabilityTotal = 0;
            const divider = data.length * 10
            data.map(item => {
                valueTotal = valueTotal + parseInt(item.valueStrategies);
                successTotal = successTotal + parseInt(item.perceivedSuccess);
                scalabilityTotal = scalabilityTotal + parseInt(item.perceivedScalability);
            })
            if (valueTotal / divider < 0.8 || successTotal / divider < 0.7 || scalabilityTotal / divider < 0.9) {
                outcome = "rejected"
            } else {
                outcome = "cycle 2"
            }
            return projectRequestPartThreeService.update(req.params.id, { status: outcome })
        })
        .then(() => {
            return projectRequestPartThreeService.readById(req.params.id)
        })
        .then(result => {
            const notification = {
                title: result.projectName
                , isRead: false
                , notificationType: "application"
                , status: result.status
                , userId: result.requestorUserId
            }
            notificationsService.create(notification)
            if (webSocket.clients[result.requestorUserId] && webSocket.clients[result.requestorUserId].readyState === webSocket.clients[result.requestorUserId].OPEN) {
                webSocket.clients[result.requestorUserId].send(JSON.stringify(notification))
            }
        })
        .then(result => {
            res.status(200).send(result)
        })
        .catch(error => {
            console.log(error)
            res.status(500).send(error)
        })
}
