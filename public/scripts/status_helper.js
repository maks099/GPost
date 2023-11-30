function parseStatus(statusCode){
    switch (statusCode) {
        case 0:
            return 'Оформлено'
        case 1:
            return 'В дорозі'
        case 2:
            return 'Доставлено'
        case 3:
            return 'Видано'
        default:
            return 'Помилка!!!';
    }
}

function parseStatusColor(statusCode){
    switch (statusCode) {
        case 0:
            return 'background-color: #E3F2FD'
        case 1:
            return 'background-color: #FFFDE7'
        case 2:
            return 'background-color: #E8F5E9'
        case 3:
            return 'background-color: #FEF2F4'
        default:
            return 'Помилка!!!';
    }
}