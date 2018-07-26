document.addEventListener("deviceready", onDeviceReady, false);

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

    //Co,nexion INSCIPTION


    var btnConnexion = document.getElementById("btnConnexion");

    btnConnexion.addEventListener("click", function () {

        var email = document.getElementById("email").value;
        var motdepasse = document.getElementById("motdepasse").value;
        // alert(motdepasse);

        if (email != "" && motdepasse != "") {
            myDB.transaction(function (transaction) {
                var executeQuery = "SELECT * FROM membre WHERE email=? and motdepasse=?";
                transaction.executeSql(executeQuery, [email, motdepasse]
                    , function (tx, result) {
                        var lesnoms = "  ";
                        /*for (var i = 0; i < result.rows.length; i++) {
                            lesnoms+=result.rows.item(i).motdepasse;

                        }*/

                        if (result.rows.length > 0) {
                            alert("Connexion réussie");
                            window.location.href = "carte.html"
                        } else {
                            alert("Echec d'authentification");
                        }

                        // window.location.href="connexion.html";
                    },
                    function (error) {
                        alert('Erreur SQL' + error);
                    });
            });


        } else {
            alert("Tous les champs sont obligatoires");
        }
    })


}