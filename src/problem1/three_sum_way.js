// use recursion method
var sum_to_n_a = function(n) {
    if(n<=1){
        return 1;
    }else{
        return parseInt(n) + arguments.callee(n-1)
    }
};

// use for loop
var sum_to_n_b = function(n) {
    let sum=0;
    for(i=1;i<=n;i++){
        sum+=i;
    }
    return sum
};

// use while loop
var sum_to_n_c = function(n) {
    let sum=0;
    let i=1;
    while(i<=n){
        sum+=i;
        i++;
    }
    return sum;
};
