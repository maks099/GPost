let rowIndex = 1;

sendingArr.forEach(element => {
    addTableRow(element);
});

function addTableRow(element){
    if(workerPanel){
        addTableRowSimple(element)
        return;
    }
    const propertiesArr = element.properties.split(' ');
    const propertiesString = propertiesArr[0] + ' кг. / ' + propertiesArr[1] + ' × ' + propertiesArr[2] + ' × ' + propertiesArr[3] + ' см.³'
    $('#tableBody').append(
        `
        <tr id="${element._id}" class="align-items-center sending-item" style=" ${parseStatusColor(element.status)}">
            <th class="align-middle" >${rowIndex}</th>
            <td class="statusField align-middle" >${element._id}</td>
            <td class="statusField align-middle" >${parseStatus(element.status)}</td>
            <td class="align-middle">
                ${element.department.name}
                <br>
                <small>
                    ${element.department.address}
                </small>
            </td>
            <td class="align-middle">${propertiesString}</td>
            <td class="align-middle">${element.date.split('T')[0]}</td>
        </tr>
        `
    )
    rowIndex++;
}

function addTableRowSimple(element){
    const propertiesArr = element.properties.split(' ');
    const propertiesString = propertiesArr[0] + ' кг. / ' + propertiesArr[1] + ' × ' + propertiesArr[2] + ' × ' + propertiesArr[3] + ' см.³'
    $('#tableBody').append(
        `
        <tr id="${element._id}" class="align-items-center sending-item" style=" ${parseStatusColor(element.status)}">
            <th class="align-middle" >${rowIndex}</th>
            <td class="statusField align-middle" >${element._id}</td>
            <td class="statusField align-middle" >${parseStatus(element.status)}</td>
            <td class="align-middle">${propertiesString}</td>
            <td class="align-middle">${element.date.split('T')[0]}</td>
        </tr>
        `
    )
    rowIndex++;
}

$('#tableSearch').on('input', e => {
    const query = $('#tableSearch').val().trim();
    $('#tableBody').empty();
    rowIndex = 0;
    if(query.length == 0){
        sendingArr.forEach(element => {
           addTableRow(element);
        });
    } else {
        sendingArr.forEach(element => {
            if(parseStatus(element.status).includes(query)
                || element.date.includes(query)){
                    addTableRow(element);
                }
           
        });
    }
})


socket.on('sending_status_changed', function(msg) {
    const obj = sendingArr.find(x => x._id == msg.sending_id)
    obj.status = msg.status;
    sendingArr = sendingArr.filter(x => x._id != msg.sending_id);
    sendingArr.push(obj)
    $(`#${msg.sending_id}`).find('.statusField').text(parseStatus(msg.status))
    $(`#${msg.sending_id}`).attr('style', parseStatusColor(msg.status));
});

