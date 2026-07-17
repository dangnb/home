import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { environment } from '../../environments/environment';

export interface Position {
  id: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PositionService extends BaseCrudService<Position> {
  protected apiUrl = `${environment.apiUrl}/hr/positions`;
}
