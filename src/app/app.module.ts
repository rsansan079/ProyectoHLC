import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
AngularFireModule,
AngularFireStorageModule],
  providers: [ImagePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
