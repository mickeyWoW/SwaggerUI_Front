import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../../core/services/user.service";
import { SharedAnimations } from "../../../shared/animations/shared-animations";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  animations: [SharedAnimations],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  isloader: boolean;
  isSubmitted: boolean;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      role_id:[0, Validators.required]
    });
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isloader = true;
    this.userService.signUp(this.form.value).subscribe(
      (response) => {
        this.toastr.success("Signup Successfull", "", {
          timeOut: 3000,
        });
        this.router.navigateByUrl("/sessions/signin");
        console.log(response);
      },
      (err) => {
        console.log(err);
      },
    );
  }
  get f() {
    return this.form.controls;
  }
}
