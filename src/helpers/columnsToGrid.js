module.exports = function (columns) {
    switch (parseInt(columns)) {
        case 1:
            return '12'
        case 2:
            return '6'
        case 3:
        default:
            return '4'
    }
}
