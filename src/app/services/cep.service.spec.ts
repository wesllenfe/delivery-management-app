import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CepService } from './cep.service';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CepService]
    });

    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch address data from ViaCEP API', () => {
    const mockCep = '01001000';
    const mockResponse = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107'
    };

    service.getAddressByCep(mockCep).subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(data.logradouro).toBe('Praça da Sé');
      expect(data.localidade).toBe('São Paulo');
    });

    const req = httpMock.expectOne(`https://viacep.com.br/ws/${mockCep}/json/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
