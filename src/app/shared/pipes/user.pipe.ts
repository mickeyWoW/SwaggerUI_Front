import { Pipe, PipeTransform } from "@angular/core";
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";

@Pipe({
  name: "User",
})
export class UserPipe implements PipeTransform {
  constructor(private userService: UserService) {}
  transform(id: number) {
    if (id === null || id === undefined) {
      return;
    }

    return this.userService.getUserById(id).pipe(
      map((response) => {
        console.log(response);
        const name = response.firstname + " " + response.lastname;
        return name;
      }),
    );
  }
}
