document.addEventListener("deviceready", onDeviceReady, false);
let positionCurrent;
let cheminImage;

var options = {
    enableHighAccuracy: true,
    maximumAge: 3600000
}
navigator.geolocation.watchPosition(onSuccess, onError, options);

function onSuccess(position) {


    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    positionCurrent = position;
};

function onError(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}


function onDeviceReady() {
    alert(positionCurrent);
    var myDB;
    if (navigator.userAgent.match(/(Android)/)) {

        myDB = window.sqlitePlugin.openDatabase({name: "snp.db", location: 'default'},function (db) {
           // alert("db connecté")
        }, function () {
            alert("erreur de connexion à la base de donnée")
        });
        //myDB = window.sqlitePlugin.openDatabase({name: 'mydb.db', location: 'default' }, function (db) {}, function (error) { console.log('Open database ERROR: ' + JSON.stringify(error)); });
        console.log('DB: SQLite');

    } else {

        myDB = window.openDatabase('mydb', "0.1", "mydb description", 200000);
        console.log('DB: WebSQL');
    }

    createPhotoTable(myDB);
    document.getElementById("savePhoto").addEventListener("click", function () {

        var descriprion = document.getElementById("description").value;
        var lat = positionCurrent.coords.latitude;
        var long = positionCurrent.coords.longitude;
        insertPhotoData(myDB, lat, long, descriprion, cheminImage);
        alert(positionCurrent.coords.longitude);
        //saveData(myDB)
    });


    document.getElementById("takePick").addEventListener("click", function () {
        cameraTakePicture();
    });
}

function initializeDb() {

    if (navigator.userAgent.match(/(Android)/)) {

        var myDB = window.sqlitePlugin.openDatabase({name: "snp.db", location: 'default'});
        //myDB = window.sqlitePlugin.openDatabase({name: 'mydb.db', location: 'default' }, function (db) {}, function (error) { console.log('Open database ERROR: ' + JSON.stringify(error)); });
        console.log('DB: SQLite');

    } else {

        var myDB = window.openDatabase('mydb', "0.1", "mydb description", 200000);
        console.log('DB: WebSQL');
    }


}


function createPhotoTable(myDB) {


    myDB.transaction(function (transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS photo (id integer primary key,  description varchar(255),lat varchar(255), long varchar(255), chemin_photo varchar(255))', [],
            function (tx, result) {
               //  alert("La table a été bien créé");
            },
            function (error) {
                alert("Erreur lors de la création de la table");
            });
    });

}



function insertPhotoData(myDB, lat, long, description, cheminImage) {
    if (long != "" && lat != "" && description) {
        myDB.transaction(function (transaction) {
            var executeQuery = "INSERT INTO photo (lat, long,description,chemin_photo) VALUES (?,?,?,?)";
            transaction.executeSql(executeQuery, [lat, long, description, cheminImage]
                , function (tx, result) {
                    alert('Photo bien et description enregistrée');
                    window.location.href = "carte.html";
                },
                function (error) {
                    alert('Erreur SQL');
                });
        });
    } else {
        alert("Tous les champs sont obligatoires");
    }

}


function cameraTakePicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
          //sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });

    function onSuccess(imageData) {
        var image = document.getElementById('photoTaken');
        image.src = "data:image/jpeg;base64," + imageData;


        movePic(imageData)
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }

}


function movePic(imageData) {
    console.log("move pic");
    console.log(imageData);
    //alert('Mooving')
    //window.resolveLocalFileSystemURL(imageData, resolveOnSuccess, resOnError);
    window.resolveLocalFileSystemURL(imageData, function (entry) {
        var nativePath = entry.toURL();
        console.log('Native URI: ' + nativePath);
         document.getElementById('photoTaken').src = nativePath;
        window.cordova.plugins.imagesaver.saveImageToGallery(imageData, onSaveImageSuccess, onSaveImageError);

    });
    function onSaveImageSuccess(path) {
        console.log('--------------success');
        cheminImage=path;
       // alert("image sauvegardé"+ path);
    }

    function onSaveImageError(error) {
        console.log('--------------error: ' + error);


        alert("Impossible de sauvegarder. Erreur:" + err);
    }
}

function resolveOnSuccess(entry) {
    console.log("resolvetosuccess");

    //new file name
    var newFileName = itemID + ".jpg";
    var myFolderApp = "ImgFolder";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
            console.log("folder create");

            //The folder is created if doesn't exist
            fileSys.root.getDirectory(myFolderApp,
                {create: true, exclusive: false},
                function (directory) {
                    console.log("move to file..");
                    entry.moveTo(directory, newFileName, successMove, resOnError);
                    console.log("release");

                },
                resOnError);
        },
        resOnError);
}

function successMove(entry) {
    //I do my insert with "entry.fullPath" as for the path
    console.log("success");
    //this is file path, customize your path
    console.log(entry);
    alert("succes")
}

function resOnError(error) {
    console.log("failed");
    //alert(error.)
}
