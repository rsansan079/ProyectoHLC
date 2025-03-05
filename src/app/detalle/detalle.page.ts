import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {
  tareaEditando: Tarea;
  id: string;
  modoNuevo: boolean = false; // Detecta si es un nuevo elemento

  constructor(
    private activatedRoute: ActivatedRoute, 
    private firestoreService: FirestoreService, 
    private router: Router,
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
}
