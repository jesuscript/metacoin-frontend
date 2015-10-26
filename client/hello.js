web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

metaCoin = web3.eth.contract([{
  constant: true,
  inputs: [{
    name: "",
    type: "address"
    
  }],
  name: "balances",
  outputs: [{
    name: "",
    type: "uint256"
    
  }],
  type: "function"
  
}, {
  constant: false,
  inputs: [{
    name: "receiver",
    type: "address"
    
  }, {
    name: "amount",
    type: "uint256"
    
  }],
  name: "sendCoin",
  outputs: [{
    name: "sufficient",
    type: "bool"
    
  }],
  type: "function"
  
}, {
  inputs: [],
  type: "constructor"
  
}]);

Template.hello.helpers({
  latestBlockNum: function(){
    return Session.get("latestBlockNum");
  },
  metacoinBalance: function(){
    return Session.get("metacoinBalance");
  },
  contractNotBound: function(){
    return !Session.get("contractBound");
  }
});

Template.hello.events({
  "submit form#transfer": function (e, tmpl) {
    e.preventDefault();
    metaCoin.sendCoin($("[name=address]").val(), $("[name=amount]").val(), {
      from: web3.eth.accounts[0],
      gas: 1000000
    });
  },
  "submit form#address": function(e, tmpl){
    e.preventDefault();
    metaCoin = metaCoin.at(tmpl.$("[name=address]").val());
    Session.set("contractBound", true);
    web3.eth.filter("latest", function(){
      Session.set("latestBlockNum", web3.eth.getBlock("latest").number);
      Session.set("metacoinBalance", metaCoin.balances(web3.eth.accounts[0]).toString());
      //Session.set("metacoinBalance", metaCoin.balances("0x0f1fb64eb98b86e2ee5f87712706ba5900d9690e").toString());
    });

    //Session.set("metacoinBalance", metaCoin.balances("0x0f1fb64eb98b86e2ee5f87712706ba5900d9690e").toString());
    Session.set("metacoinBalance", metaCoin.balances(web3.eth.accounts[0]).toString());
  }
});

Template.hello.onRendered(function(){
  Session.set("latestBlockNum", web3.eth.getBlock("latest").number);
});

