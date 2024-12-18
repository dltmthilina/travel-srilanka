interface UserProps {
  id: number | null;
  fName: string;
  lName: string;
  email: string;
}

export class Tourist implements UserProps {
  id: number | null;
  fName: string;
  lName: string;
  email: string;
  country: string;

  constructor(
    id: number | null,
    fname: string,
    lname: string,
    email: string,
    country: string
  ) {
    this.id = id;
    this.fName = fname;
    this.lName = lname;
    this.email = email;
    this.country = country;
  }

  create() {}
  getById() {}
  getByPlaceId() {}
  getAll() {}
  update() {}
  delete() {}
}
