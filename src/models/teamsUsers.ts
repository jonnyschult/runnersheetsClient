export class TeamsUsers {
  constructor(
    public role: string,
    public team_id: number,
    public user_id: number,
    public id?: number,
    public created_at?: string,
    public updated_at?: string
  ) {}
}
