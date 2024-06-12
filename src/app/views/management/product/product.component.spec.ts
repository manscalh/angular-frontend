import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;

  beforeEach(() => {
    component = new ProductComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
