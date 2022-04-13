import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import {
  ResolveEnd,
  ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from "@angular/router";
import { UserService } from "../../../core";
import { SharedAnimations } from "../../../shared/animations/shared-animations";

import { AuthService } from "../../../shared/services/auth.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
  animations: [SharedAnimations],
})
export class SigninComponent implements OnInit {
  loading: boolean;
  loadingText: string;
  form: FormGroup;
  error: any;
  isSubmitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (
        event instanceof RouteConfigLoadStart ||
        event instanceof ResolveStart
      ) {
        this.loadingText = "Loading Dashboard Module...";

        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }
    });
    document.getElementById("adminrole").focus();
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      role_id : [0]
    });
  }
  updateRoleId(id){
    (this.form.controls.role_id as FormControl)
    .setValue(id);
  }
  signin() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.loadingText = "Sigining in...";
    this.userService.login(this.form.value).subscribe(
      (res) => {
        console.log(res);
        if (res.statut === 200) {
          this.router.navigateByUrl("/dashboard/v1");
          this.loading = false;
        }
        else{
          this.error = res.message;
          this.loading = false;
        }
      },
      (err) => {
        this.router.navigateByUrl("/sessions/signin");
        console.log(err);
        this.error = err.message;
        this.loading = false;
      },
    );
  }
  get f() {
    return this.form.controls;
  }
}
