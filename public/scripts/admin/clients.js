
clientsArr.forEach(e => {
    addClient(e);
});


$('body').on('click', '.del-client', e => {
    const id = $(e.target).closest('.list-group-item').attr('id');
    const del = confirm("Ви справді бажаєте видалити цього клієнта?");
    if(del){
        jQuery.ajax({
            type: "post",
            url: "/deleteClient",
            data: {
                id: id,
            },
            success: (result) => { location.reload() },
            error: (error) => { location.reload() },
        });
    }
});


$('.client_filter').on('input', function(){
   
    const firstName = $('#clientFirstName').val().trim().toUpperCase();
    const lastName = $('#clientLastName').val().trim().toUpperCase();
    const email = $('#clientEmail').val().trim().toUpperCase();

    $('#clientsListView').empty();

    if(firstName.length == 0 && lastName.length == 0 && email.length == 0){
        clientsArr.forEach(e => {
           addClient(e);
        })
    } else {
        clientsArr.forEach(e => {
            if(e.first_name.toUpperCase().includes(firstName) 
                && e.last_name.toUpperCase().includes(lastName) 
                && e.email.toUpperCase().includes(email)){
                    addClient(e);
            }
        })
    }
})


function addClient(e){
    $('#clientsListView').append(`
        <div class="list-group-item d-flex flex-row client-item align-items-center justify-content-between" id="${e._id}">
            <div class="">
                <div><span>${e.first_name} ${e.last_name} / ${e.email}</span></div>
                <div><span>Оформлено відправлень: ${e.sendings_count}</span></div>
            </div>
            <div class="d-flex flex-column justify-content-end">
                <i class="bi bi-person-x mx-1 del-client" style="font-size: 1.75rem; cursor: pointer;" title="Видалити"></i>
            <div>
        </div>
    `
    )
}