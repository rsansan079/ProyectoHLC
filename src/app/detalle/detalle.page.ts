import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {
  tareaEditando: Tarea;
  id: string;
  imagenSelec: string;
  modoNuevo: boolean = false; // Detecta si es un nuevo elemento

  constructor(
    private activatedRoute: ActivatedRoute, 
    private firestoreService: FirestoreService, 
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
    private alertController: AlertController 
  ) { 
    this.tareaEditando = {} as Tarea;
  }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (idRecibido === "nuevo") {
      this.modoNuevo = true;
      this.id = "";
      this.tareaEditando = {} as Tarea; // Se inicializa vacío para nuevo registro
    } else {
      this.modoNuevo = false;
      this.id = idRecibido ?? "";

      this.firestoreService.consultarPorId("coches-rafa", this.id).subscribe((resultado: any) => {
        if (resultado.payload.data() != null) {
          this.tareaEditando = resultado.payload.data();
        }
      });
    }
  }

  clicBotonGuardar() {
    this.firestoreService.insertar("coches-rafa", this.tareaEditando).then(() => {
      console.log("Coche añadido correctamente");
      this.router.navigate(['/']);
    });
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("coches-rafa", this.id, this.tareaEditando).then(() => {
      console.log("Coche modificado correctamente");
      this.router.navigate(['/']);
    });
  }


  
    async confirmarBorrado() {
      const alert = await this.alertController.create({
        header: 'Confirmar Borrado',
        message: '¿Estás seguro de que quieres eliminar este coche?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Borrado cancelado');
            }
          },
          {
            text: 'Borrar',
            cssClass: 'danger',
            handler: () => {
              this.clicBotonBorrar();
            }
          }
        ]
      });
  
      await alert.present();
    }

  clicBotonBorrar() {
    this.firestoreService.borrar("coches-rafa", this.id).then(() => {
      console.log("Coche eliminado correctamente");
      this.router.navigate(['/']);
    });
  }



  async seleccionarImagen() {
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permisos de lectura, solicitarl al usario
        if (result === false) {
          this.imagePicker.requestReadPermission();
        } else {
          // Abrir selector de imágenes
          this.imagePicker.getPictures({
            maximumImagesCount: 1, // Permite seleccionar un máximo de 1 imagen
            outputType: 1 // 0=BASE64 1=URI
          }).then(
            (results) => {
              if (results.length > 0) {
                this.imagenSelec = "data:image/jpeg;base64," + results[0];
                console.log("Imagen que se ha seleccionado (en Base64):" + this.imagenSelec);
              }
            },
            (err) => console.log(err)
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

async subirImagen() {
  const loading = await this.loadingController.create({
    message: 'Subiendo imagen...'
  });
  // Mensaje de finalizacion de subida de imagen
  const toast = await this.toastController.create({
  message: 'Image was updated succesfully',
  duration: 3000
  });

  //Carpeta donde se alamcaenara
  let nombreCarpeta ="imagenes-rafa";

  //Mostrar el mensaje de espera
  loading.present();
  //Asignar el nombre de la imagen en funcion de la hora actual
  //para evitar duplicidades de nombres
  let nombreImagen = `${new Date().getTime()}`;
  //LLamar al metodo para subir la imagen
  this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec)
  .then(snapshot => {
    snapshot.ref.getDownloadURL()
    .then(downloadURL => {
      console.log("URL de descarga: " + downloadURL);
      toast.present();
      loading.dismiss();

    })



})
}


async eliminarArchivo(fileURL:string) {
  const toast = await this.toastController.create({
    message: 'File was deleted successfully',
    duration: 3000
  });
  this.firestoreService.eliminarArchivoPorURL(fileURL)
  .then(() => {
    toast.present();
  }, (err) => {
    console.log(err);
  });
}












}












