document.addEventListener("deviceready",onDeviceReady, false);

function onDeviceReady() {
    var myDB;
    if (navigator.userAgent.match(/(Android)/)) {

        myDB = window.sqlitePlugin.openDatabase({name: "snp.db", location: 'default'});
        //myDB = window.sqlitePlugin.openDatabase({name: 'mydb.db', location: 'default' }, function (db) {}, function (error) { console.log('Open database ERROR: ' + JSON.stringify(error)); });
        console.log('DB: SQLite');

    }else {

        myDB = window.openDatabase('mydb', "0.1", "mydb description", 200000);
        console.log('DB: WebSQL');
    }



    myDB.transaction(function(transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS membre (id integer primary key,  nom varchar(255),prenom varchar(255), email varchar(255), motdepasse varchar(255))', [],
            function(tx, result) {
              //  alert("La table a été bien créé");
            },
            function(error) {
                alert("Erreur SQL.");
            });
    });


    //SAVE INSCIPTION


    var btnIscription= document.getElementById("saveInscription");

    btnIscription.addEventListener("click", function () {
        var nom = document.getElementById("nom").value;
        var prenom = document.getElementById("prenom").value;
        var email = document.getElementById("email").value;
        var motdepasse = document.getElementById("motdepasse").value;


        if(nom !="" && prenom !="" && email !="" && motdepasse !=""){
            myDB.transaction(function(transaction) {
                var executeQuery = "INSERT INTO membre (nom, prenom,email,motdepasse) VALUES (?,?,?,?)";
                transaction.executeSql(executeQuery, [nom,prenom,email,motdepasse]
                    , function(tx, result) {
                        alert('Vous êtes bien inscrit');
                        window.location.href="connexion.html";
                    },
                    function(error){
                        alert('Erreur SQL');
                    });
            });
        }else {
            alert("Tous les champs sont obligatoires");
        }
    })


}