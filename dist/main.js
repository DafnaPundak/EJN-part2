const render = function (player) {
    $(`#roster`).empty()
    let source = $(`#roster-template`).html()
    let template = Handlebars.compile(source)
    let newHTML = template({ player })

    $(`#roster`).append(newHTML)
}

const fetch1 = function () {
    let input = $(`#input`).val()
    $.get(`/teams/${input}`, function (response) {
        render(response)
    })
}

$("body").on("click", ".player-image", function () {
    let playerName = $(this).siblings(".name").text()
    $.get(`/playerStats/${playerName}`, function (response) {
        $(".player-image").siblings(".stats").append(`
        Games played: ${response.games_played},
        Minutes per game: ${response.minutes_per_game}
        `)
    })
})

const fetch2 = function () {
    $.get(`/dreamTeam`, function(dreamTeam) {
        console.log(dreamTeam)

        $(`#dreamTeam-container`).empty()
        const source = $(`#dreamTeam-template`).html()
        const template = Handlebars.compile(source)
        const newHTML = template({ dreamTeam })

        $(`#dreamTeam-container`).append(newHTML)
    })
}

$("body").on("click", "#addPlayer", function () {
    let playerFirstName = $(this).siblings(".name").text().split(" ")[0]
    let playerLastName = $(this).siblings(".name").text().split(" ")[1]
    let playerJersey = $(this).siblings(".number").text()
    let playerPos = $(this).siblings(".position").text()
    let playerObject = {
        firstName : playerFirstName,
        lastName : playerLastName,
        jersey: playerJersey,
        pos: playerPos 
    }
    console.log(playerObject)
    $.post(`/roster`, playerObject, function (response) {
        console.log(response)
    })
})

