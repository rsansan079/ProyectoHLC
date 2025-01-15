import { Component } from '@angular/core';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  tareaEditando: Tarea;
  arrayColeccionTareas: any = [{
    id: "",
    data: {} as Tarea

  }];




  constructor(private firestoreService: FirestoreService) {
    // Crear una tarea vacía al empezar
    this.tareaEditando = {} as Tarea;



    this.obtenerListaTareas();
  }




  clickBotonInsertar() {
    this.firestoreService.insertar("tareas", this.tareaEditando)
      .then(() => {
        console.log('Tarea creada correctamente');
        //Limpiar el contenido de la tarea que se está editando
        this.tareaEditando = {} as Tarea;
      }, (error) => {
        console.error(error);
      });
  }



  obtenerListaTareas() {
    this.firestoreService.consultar("tareas").subscribe((resultadoConsultaTareas) => {

      this.arrayColeccionTareas = [];
      resultadoConsultaTareas.forEach((datosTarea: any) => {
        this.arrayColeccionTareas.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        })
      })
    }
    )
  }
}
