import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../../app-services/customer-service/Customer.model';
import { OrderService } from '../../../app-services/order-service/order.service';
import { OrderDetailService } from '../../../app-services/orderDetail-service/orderDetail.service';
import { Order } from '../../../app-services/order-service/order.model';
import { OrderDetail } from '../../../app-services/orderDetail-service/orderDetail.model';
import { CustomerService } from '../../../app-services/customer-service/customer.service';
import { Cake } from '../../../app-services/cake-service/cake.model';
import { CakeService } from '../../../app-services/cake-service/cake.service';
import { Point } from 'src/app/app-services/point-service/point.model';
import { PointService } from 'src/app/app-services/point-service/point.service';
import { DiscountCodeService } from 'src/app/app-services/discountCode-Service/discountCode.service';
import { DiscountCode } from 'src/app/app-services/discountCode-Service/discountCode.model';
declare var $: any;
@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent implements OnInit {

  constructor(private _router: Router, private _order: OrderService, private _customer: CustomerService, private _orderDetail: OrderDetailService, private _cake: CakeService, private _pointService: PointService) { }
  //chứa thông tin giỏ hàng
  CartCake = [];

  orders: Order = new Order;
  list_all_customer: Array<Customer>;
  list_Order: Array<Order>;
  list_OrderDetail: Array<OrderDetail>;
  list_Cake: Array<Cake>;
  TongTien = 0;
  TongCount = 0;
  point: Point = new Point;
  lengthCartCake = 0;
  expandedIndex=-1
  //thông tin login
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');

  ngOnInit() {
    this.script_Frontend();
  //   if (this.statusLogin == null) { this._router.navigate(['/account']);
  // console.log("abc") }
    this.getAllOrder();
    this.getAllCustomer();
    this.getAllOrderDetail();
    this.getAllCake();

    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();
    // this.sortByDate();


  }
  script_Frontend() {
    $('#future-orders').css('display', 'none');
    $('#done-orders').css('display', 'none');

    $('#toggle-orders li').click(function () {
      $('#toggle-orders li').not(this).removeClass('selected');
      $(this).addClass('selected');
    });


    $('.fo').click(function () {
      $('#order-history').hide();
      $('#done-orders').hide();
      $('#future-orders').fadeIn('fast');
    });

    $('.oh').click(function () {
      $('#order-history').fadeIn('fast');
      $('#future-orders').hide();
      $('#done-orders').hide();
    });

    $('.com').click(function () {
      $('#order-history').hide();
      $('#future-orders').hide();
      $('#done-orders').fadeIn('fast');
    });

    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
  }


  // set độ dài của giỏ hàng
  cartCakeLength(CartCake) {
    if (CartCake == null) {
      this.lengthCartCake = 0;
    } else {
      this.lengthCartCake = CartCake.length;
    }
  }
  //get total count and price 
  getTotalCountAndPrice() {
		this.TongTien = 0;
		this.TongCount = 0;
		this.CartCake = JSON.parse(localStorage.getItem("CartCake"));
		this.cartCakeLength(this.CartCake);
		if (this.CartCake != null) {
			for (var i = 0; i < this.lengthCartCake; i++) {
        this.TongTien += parseInt((parseInt(this.CartCake[i].priceCake) * parseInt(this.CartCake[i].count)*(100-this.CartCake[i].sale)/100).toFixed(0));
				this.TongCount += parseInt(this.CartCake[i].count);
			}
		}
		$('#tongtien').html("&nbsp;" + this.formatCurrency(this.TongTien.toString()));
		$('.cart_items').html(this.TongCount.toString());
		localStorage.setItem("TongTien", this.TongTien.toString());
		localStorage.setItem("TongCount", this.TongCount.toString());
	  }
	  //#endregion
	   formatCurrency(number){
		var n = number.split('').reverse().join("");
		var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");    
		return  n2.split('').reverse().join('') + 'VNĐ';
	}
  // get order by userID
  getAllOrder() {
    this._order.getOrderList().subscribe(
      listOrder => {
        this.list_Order = listOrder as Order[]; 
      // console.log(Date.parse((this.list_Order[0].orderDate).toString()))
      // console.log(Date.parse((this.list_Order[1].orderDate).toString()))
      },
      error => console.log(error)
    );
  }
   sortByDueDate() {
}
  getAllCustomer() {
    this._customer.getCustomerList().subscribe(
      allCustomerlist => {
        this.list_all_customer = allCustomerlist as Customer[];
      });
  }
  getAllOrderDetail() {
    this._orderDetail.getOrderDetailList().subscribe(
      allOrderDetailList => {
        this.list_OrderDetail = allOrderDetailList as OrderDetail[];
      });
  }
  getAllCake() {
    this._cake.getCakeList().subscribe(
      allCakeList => {
        this.list_Cake = allCakeList as Cake[]
      });
  }
  //update 
  ClickGiaoHang(orders: Order) {
    orders.status = "Inprogress";
    this._order.putOrder(orders).subscribe(
      order => {
        
        this.ngOnInit();

      });
  }
 
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

  ClickDaGiao(orders: Order) {
    orders.status = "Done";
    console.log(orders)
    this._customer.getUserIDByCustomerID(orders.customerID).subscribe(
      UserID => {


        this._order.putOrder(orders).subscribe(
          order => {
            this.point.point = parseInt((orders.totalPrice / 10000).toFixed(0));
            this.point.userID = Object.values(UserID)[0].userID;
            console.log(this.point);
            this._pointService.putPointByUserID(this.point).subscribe(
              pointNew => {
                
                // localStorage.setItem("Point", Object.values(pointNew)[2]);
                // this.ngOnInit();  
              }
            );



          });
      }
    )

  }
  expandRow(index: number): void {
    this.expandedIndex = index === this.expandedIndex ? -1 : index;
  }
}
