var myStoreControllers=angular.module("myStoreController",['ui.bootstrap',
                                                            'myStoreModalController',
                                                            'myStoreModalItemController'
                                                            ]);

myStoreControllers.controller('myStoreProductCtrl',function($scope,$modal,$log,Product,User,Cart){
 
 //Block to check User Has Logged in Or Not
$scope.welComeMessage="";
checkUserLogin();

function checkUserLogin(){

  if(User.isAuthenticated())
    $scope.welComeMessage="Welcome , You Can Buy Any Product";
  else
    $scope.welComeMessage="Please Login to Save Your Order";

}

// Demo - Modal Related Defiantion
$scope.items =Product.query();



// Services related defination

$scope.allProducts=Product.query();

//Show Product Details Configuration

$scope.openProduct=function(itemId){

  var itemUrl=itemId;
  var productModel=$modal.open({
    templateUrl: 'assets/app/views/itemModal.html',
    controller: 'ItemModal',
    //size: size,
    resolve: {
      items: function () {
        return itemUrl;
        },
      show : function() {
        return true;
        }
    }
  }); 

  productModel.result.then(function (selectedItem) {
    console.log(selectedItem);
    console.log("From Modal");
    addItemToCartHelper(selectedItem);
    }, function () {
      }
    );

}; 

  

//User Cart Services

$scope.cart=[];
$scope.cartLength=0;
$scope.userCartSummary;
$scope.userCartSummaryFromService=[];
$scope.userBuySummary=[];

$scope.userBuySummary[0]=Cart.getCurrentTotal();
$scope.userBuySummary[1]=Cart.getTotalNumberOfItem();


$scope.addtoCart=function(product){
  
  var fileId='id'+product.id;

  var currentItem=Product.getProduct({file:fileId}, function(data){
    addItemToCartHelper(data);     
  });

  /* this method failed becaus promise was not used
   $scope.cart.push(Product.getProduct({file:fileId}));
   $scope.cartLength=$scope.cart.length;
   $scope.userCartSummary=getCurrentMoneySum($scope.cart);
  */
};

function getCurrentMoneySum(userCartObject){

var currentSum=0;
for (var key in userCartObject)
{
   if (userCartObject.hasOwnProperty(key))
   {
      // get sum     
     currentSum = currentSum+parseInt(userCartObject[key].price);
     continue;
   };
}
return currentSum;
};

function addItemToCartHelper(data){
  Cart.addItemToCart(data);  
  $scope.cart=Cart.retiveCart();
  $scope.cartLength=$scope.cart.length;
  $scope.userCartSummaryFromService=Cart.getCartSummary();
  $scope.userCartSummary=Cart.getCurrentTotal();
  Cart.getCartSummary;
  Cart.getCartConsilidatedData();
  $scope.userBuySummary[0]=Cart.getCurrentTotal();
  $scope.userBuySummary[1]=Cart.getTotalNumberOfItem();
}








});



