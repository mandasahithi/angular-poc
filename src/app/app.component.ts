import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,            // ✅ mark as standalone
  imports: [RouterOutlet],     // ✅ only RouterOutlet needed
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  // ✅ note: it's styleUrls (plural)
})
export class AppComponent {
  title = 'angular-poc-project';
}
