var firebaseConfig = {
    apiKey: "AIzaSyBw4sXRZwjOufxjOrn7c5CEoEqczq_nD6o",
    authDomain: "mytodo-85e93.firebaseapp.com",
    projectId: "mytodo-85e93",
    storageBucket: "mytodo-85e93.appspot.com",
    messagingSenderId: "516662915757",
    appId: "1:516662915757:web:913c1ae381879076e04c24"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore().settings({ timestampInSnapshots: true });

$('#sign-up').hide();
$('#log-in').hide();
$('.adding-another-card').hide();

var User;
firebase.auth().onAuthStateChanged(user => {
    if(user){
        User = user;
        $('.user-status-button').html('Log Out');
        $('.user-status-button').click(function () {
            firebase.auth().signOut()
            .then(() => {
                localStorage.setItem('SI', '1');
                window.location.reload();
            });
        });
        firebase.firestore().collection('Users').doc(user.email).collection('ToDo').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                $(`
                    <div class="card">
                        <p> ${doc.data().message} </p>
                        <div id="date"> ${doc.data().date} </div>
                        <button class="delete" onclick="delete_card('${user.email}', 'ToDo', '${doc.id}')"> X </button>
                        <button class="next" onclick=" move_to('${user.email}', '${doc.id}', 'ToDo', 'Working')"> > </button>
                    </div>
                `).appendTo('.todo .cards');
            })
        }).then(() => {
            $('.todo .loader').hide();
        });

        firebase.firestore().collection('Users').doc(user.email).collection('Working').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                $(`
                    <div class="card">
                        <p> ${doc.data().message} </p>
                        <div id="date"> ${doc.data().date} </div>
                        <button class="delete" onclick="delete_card('${user.email}', 'Working', '${doc.id}')"> X </button>
                        <button class="next" onclick=" move_to('${user.email}', '${doc.id}', 'Working', 'Done')"> > </button>
                    </div>
                `).appendTo('.working .cards');
            })
        }).then(() => {
            $('.working .loader').hide();
        });

        firebase.firestore().collection('Users').doc(user.email).collection('Done').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                $(`
                    <div class="card">
                        <p> ${doc.data().message} </p>
                        <div id="date"> ${doc.data().date} </div>
                        <button class="delete" onclick="delete_card('${user.email}', 'Done', '${doc.id}')"> X </button>
                    </div>
                `).appendTo('.done .cards');
            })
        }).then(() => {
            $('.done .loader').hide();
        });
        
    }else {
        $('#My-ToDo').hide();
        if(localStorage.getItem('SI')){
            $('.user-status-button').html('Log In');
            $('.user-status-button').click(function () {
                $('header').hide();
                $('#log-in').show();
            });
        }else {
            $('.user-status-button').html('Sign Up');
            $('.user-status-button').click(function () {
                $('header').hide();
                $('#sign-up').show();
            })
        }
    }
});

function delete_card(email, directory, id) {
    Swal.fire({
        title: `Do you want to delete the card in ${directory}`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: `Delete`,
        denyButtonText: `Cancel`,
        showClass: {
            popup: 'delete_card_1'
        }  
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.firestore().collection('Users').doc(email).collection(directory).doc(id).delete()
            .then(() => {
                Swal.fire({
                    title: 'Confirmed!',
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: `Ok`,
                }).then(() => {
                    window.location.reload();
                })
            });
        }
    })
}

function move_to(email, id, from, to){
    firebase.firestore().collection('Users').doc(email).collection(from).doc(id).get()
    .then(doc => {
        var getDate = new Date();
        var date = `${getDate.getDate()}-${getDate.getMonth()+1}-${getDate.getFullYear()} ${(getDate.getHours() < 10) ? '0' + getDate.getHours() : getDate.getHours()}:${(getDate.getMinutes() < 10) ? '0' + getDate.getMinutes() : getDate.getMinutes()}`;    
        firebase.firestore().collection('Users').doc(email).collection(to).doc().set({
            message: doc.data().message,
            date: date,
        });
    }).then(() => {
        firebase.firestore().collection('Users').doc(email).collection(from).doc(id).delete()
        .then(() => {
            window.location.reload();
        });
    });
}

$('.todo .add-another-card').click(function () {
    $('.todo .adding-another-card').show();
});

$('.working .add-another-card').click(function () {
    $('.working .adding-another-card').show();
});

$('.done .add-another-card').click(function () {
    $('.done .adding-another-card').show();
});

$('.todo-submit').click(function () {
    add_card('.todo-input', 'ToDo');
});

$('.working-submit').click(function () {
    add_card('.working-input', 'Working');
});

$('.done-submit').click(function () {
    add_card('.done-input', 'Done');
});

$('#having-account').click(function () {
    $('#sign-up').hide();
    $('#log-in').show();
});

$('#not-having-account').click(function () {
    $('#sign-up').show();
    $('#log-in').hide();
})

function add_card(input, directory){
    if($(input).val() !== ''){
        var getDate = new Date();
        var date = `${getDate.getDate()}-${getDate.getMonth()+1}-${getDate.getFullYear()} ${(getDate.getHours() < 10) ? '0' + getDate.getHours() : getDate.getHours()}:${(getDate.getMinutes() < 10) ? '0' + getDate.getMinutes() : getDate.getMinutes()}`;
        firebase.firestore().collection('Users').doc(User.email).collection(directory).doc().set({
            message: $(input).val(),
            date: date,
        }).then(() => {
           window.location.reload();
        })
        .catch(() => {
            window.location.reload();
        })
    }
}

$('#sign-up-button').click(function () {
    var getDate = new Date();
    var date = `${getDate.getDate()}-${getDate.getMonth()+1}-${getDate.getFullYear()} ${(getDate.getHours() < 10) ? '0' + getDate.getHours() : getDate.getHours()}:${(getDate.getMinutes() < 10) ? '0' + getDate.getMinutes() : getDate.getMinutes()}`;
    firebase.auth().createUserWithEmailAndPassword($('.sign-up #email').val(), $('.sign-up #password').val())
    .then(() => {
        firebase.firestore().collection('Users').doc($('.sign-up #email').val()).set({
            password: $('.sign-up').val(),
        });

        firebase.firestore().collection('Users').doc($('.sign-up #email').val()).collection('ToDo').doc().set({
            message: 'First card!',
            date: date,
        });
        firebase.firestore().collection('Users').doc($('.sign-up #email').val()).collection('Working').doc().set({
            message: 'First card!',
            date: date,
        });
        firebase.firestore().collection('Users').doc($('.sign-up #email').val()).collection('Done').doc().set({
            message: 'First card!',
            date: date,
        });    
        $('#error-message').html('');
    })
    .then(() => {
        $('#My-ToDo').show();
        $('header').show();
        $('#sign-up').hide();
    })
    .catch(err => {
        $('#error-message').html(err.message);
    });
});