export interface IPerson {
	id?: number,
    fname: string,
    lname: string,
    dob: Date,
    country?: string,
    address?: string,
    email: string,
    phone?: string,
    password: string,
    role: number,
    team_id?: number
}

// interface PersonDto {
//     fname: string,
//     lname: string,
//     dob: string,
//     country: string,
//     address: string,
//     email: string,
//     phone: string,
//     password: string,
//   }