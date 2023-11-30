let sending = {};




socket.on('sending_status_changed', function(msg) {
    const obj = sendingArr.find(x => x._id == msg.sending_id)
    obj.status = msg.status;
    sendingArr = sendingArr.filter(x => x._id != msg.sending_id);
    sendingArr.push(obj)
    $(`#${msg.sending_id}`).find('.statusField').text(parseStatus(msg.status))
});


socket.on('added_sending', function(sending) {
    console.log(sending)
    if(sending.department == department._id){
        sendingArr.push(sending);
        addTableRowSimple(sending)
    }
});

$('body').on('click', '.sending-item', function(e){
    $(".sending-item").removeClass("bg-primary text-light rounded");
    $(e.target).closest('.sending-item').addClass('bg-primary text-light rounded');
    
    sending = sendingArr.find(x => x._id == $(e.target).closest('.sending-item').attr('id'));
    $('#actionList button').addClass('d-none');
    switch(sending.status){
        case 0:{
            $('#btnOnRoad').removeClass('d-none');
            break;
        }
        case 1:{
            $('#btnDelivered').removeClass('d-none');
            break;
        }
        case 2:{
            $('#btnGiveToUser').removeClass('d-none');
            break;
        }
    }
})


$('#btnOnRoad').on('click', function() {
    if($('#tableBody .sending-item').hasClass('bg-primary')){
        jQuery.ajax({
            type: "post",
            url: "/changeStatus",
            data: {
                'status': 1,
                'sending_id': sending._id
            },
            success: (data) => {
               updateStatus(1)
            },
            error: (error) => alert(error.message),
        });
    } else {
        alert('Виберіть відправлення у таблиці відправлень!')
    }
})

$('#btnDelivered').on('click', function() {
    if($('#tableBody .sending-item').hasClass('bg-primary')){
        jQuery.ajax({
            type: "post",
            url: "/changeStatus",
            data: {
                'status': 2,
                'sending_id': sending._id
            },
            success: (data) => {
               updateStatus(2)
            },
            error: (error) => alert(error.message),
        });
    } else {
        alert('Виберіть відправлення у таблиці відправлень!')
    }
})

$('#btnGiveToUser').on('click', function() {
    if($('#tableBody .sending-item').hasClass('bg-primary')){
        let code = '';
        for(let i = 0; i < 4; i++){
            const randomNumber = Math.floor(Math.random() * 9);
            code += randomNumber;
        }
        socket.emit('send_give_code', {
            client: sending.client,
            code: code
        });
        const userCode = prompt("Код для видачі посилки з'явився у консолі користувача. Введіть цей код:", 0);
        if(userCode == code){
            alert("Код вірний!")
            jQuery.ajax({
                type: "post",
                url: "/changeStatus",
                data: {
                    'status': 3,
                    'sending_id': sending._id
                },
                success: () => {
                    updateStatus(3);
                },
                error: (error) => alert(error.message),
            });
        } else{
            alert("Код не вірний!!! Повторіть спробу")
        }
        
    } else {
        alert('Виберіть відправлення у таблиці відправлень!')
    }
})

function updateStatus(status){
    $('#tableBody .sending-item').removeClass('bg-primary text-light rounded')
    socket.emit('sending_status_changed', {
        sending_id: sending._id,
        status: status
    });
}
