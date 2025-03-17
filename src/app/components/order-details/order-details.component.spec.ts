import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { IonicModule, ModalController } from "@ionic/angular"
import { OrderDetailsComponent } from "./order-details.component"
import { CommonModule } from "@angular/common"

describe("OrderDetailsComponent", () => {
  let component: OrderDetailsComponent
  let fixture: ComponentFixture<OrderDetailsComponent>
  let modalControllerSpy: jasmine.SpyObj<ModalController>

  beforeEach(async () => {
    const spy = jasmine.createSpyObj("ModalController", ["dismiss"])

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CommonModule, OrderDetailsComponent],
      providers: [{ provide: ModalController, useValue: spy }],
    }).compileComponents()

    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>

    fixture = TestBed.createComponent(OrderDetailsComponent)
    component = fixture.componentInstance

    component.order = {
      id: "1",
      recipientName: "Test User",
      address: {
        street: "Test Street",
        number: "123",
        neighborhood: "Test Neighborhood",
        city: "Test City",
        state: "TS",
      },
      status: "Pendente",
      createdAt: new Date(),
    }

    component["modalController"] = modalControllerSpy

    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should dismiss modal when close button is clicked", () => {

    component.dismiss()

    expect(modalControllerSpy.dismiss).toHaveBeenCalled()
  })
})

