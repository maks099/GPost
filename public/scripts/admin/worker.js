$('#addWorkerButton').on('click', e => {
    if(!$('#departmentsList .dep-item').hasClass('custom_active')){
        alert('Виберіть відділення за яким буде закріплено нового працівника');
    } else {
        $('#addWorkerModal').modal('show');
    }
})


$('body').on('click', '.worker-item', function(e){
    $(".worker-item").removeClass("custom_active");
    $(e.target).closest('.worker-item').addClass('custom_active');
});


$('body').on('click', '.edit-worker', e => {
    const id = $(e.target).closest('.list-group-item').attr('id');
    $('#editWorkerId').val(id);
    $('#editWorkerModal').modal('show');
});


$('body').on('click', '.del-worker', e => {
    const id = $(e.target).closest('.list-group-item').attr('id');
    const del = confirm("Ви справді бажаєте видалити цього працівника?");
    if(del){
        jQuery.ajax({
            type: "post",
            url: "/deleteWorker",
            data: {
                id: id,
            },
            success: (result) => { location.reload() },
            error: (error) => { location.reload() },
        });
    }
});


$('.worker_filter').on('input', function(){
    if(!$('#departmentsList .dep-item').hasClass('custom_active')){
        alert('Виберіть відділення!');
        return
    } 
    const firstName = $('#workerFirstName').val().trim().toUpperCase();
    const lastName = $('#workerLastName').val().trim().toUpperCase();
    const email = $('#workerEmail').val().trim().toUpperCase();

    $('#workersListView').empty();

    if(firstName.length == 0 && lastName.length == 0 && email.length == 0){
        workersArr.forEach(e => {
            addWorker(e);
        })
    } else {
        workersArr.forEach(e => {
            if(e.first_name.toUpperCase().includes(firstName) && e.last_name.toUpperCase().includes(lastName) && e.email.toUpperCase().includes(email)){
                addWorker(e);
            }
        })
    }
})

function addWorker(e){
    $('#workersListView').append(`
            <div class="list-group-item d-flex flex-row worker-item align-items-center justify-content-between" id="${e._id}">
                <div class="">
                    <div>${e.first_name} ${e.last_name}</div>
                    <div>${e.email}</div>
                </div>
                <div class="d-flex flex-column justify-content-end">
                    <i class="bi bi-pencil-square mx-1 edit-worker" style="font-size: 1.75rem; cursor: pointer;" title="Редагувати"></i>
                    <i class="bi bi-person-x mx-1 del-worker" style="font-size: 1.75rem; cursor: pointer;" title="Видалити"></i>
                <div>
            </div>
            `
            )
}