const express = require('express')
const router = express.Router()
const request = require('request')

let teamToIDs = {
    "lakers": "1610612747",
    "warriors": "1610612744",
    "heat": "1610612748",
    "suns": "1610612756"
}

let data = []

let dreamTeam = [
    {firstName: "?", lastName: "?", jersey: "?", pos: "?"},
    {firstName: "?", lastName: "?", jersey: "?", pos: "?"},
    {firstName: "?", lastName: "?", jersey: "?", pos: "?"},
    {firstName: "?", lastName: "?", jersey: "?", pos: "?"},
    {firstName: "?", lastName: "?", jersey: "?", pos: "?"}
]

let dreamPlayerCounter = 0

router.get('/teams/:teamName', function (req, res) {
    request.get('http://data.nba.net/10s/prod/v1/2018/players.json', function (error, response, body) {
        data = JSON.parse(response.body).league.standard

        let teamId = teamToIDs[req.params.teamName]

        let dataFiltered = data.filter(p => p.teamId === teamId && p.isActive)
        let team = dataFiltered.map(p => { return { firstName: p.firstName, lastName: p.lastName, jersey: p.jersey, pos: p.pos } })

        res.send(team)
    })
})

router.get('/playerStats/:player', function (req, res) {
    let fullName = req.params.player
    let lastName = fullName.split(' ')[1]
    let firstName = fullName.split(' ')[0]
    request.get(`https://nba-players.herokuapp.com/players-stats/${lastName}/${firstName}`, function (error, response, body) {
        // console.log(JSON.parse(response.body))
        let allStats = JSON.parse(response.body)
        res.send(allStats)
    })
})

router.put(`/team`, function (req, res) {
    const teamName = req.body.teamName
    const teamID = req.body.teamID
    teamToIDs[teamName] = teamID
    res.send(teamToIDs)
})

router.get(`/dreamTeam`, function (req, res) {
    res.send(dreamTeam)
})

router.post(`/roster`, function (req, res) {
    if (dreamPlayerCounter > 4) {
        // res.end()
        res.send("Your Dream Team is full")
        // alert("Your Dream Team is full")
    } else {
        dreamTeam[dreamPlayerCounter].firstName = req.body.firstName
        dreamTeam[dreamPlayerCounter].lastName = req.body.lastName
        dreamTeam[dreamPlayerCounter].jersey = req.body.jersey
        dreamTeam[dreamPlayerCounter].pos = req.body.pos

        dreamPlayerCounter ++
        res.send(dreamTeam)
    }
})

module.exports = router