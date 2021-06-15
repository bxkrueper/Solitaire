"use strict";

class MyMath{
    //if multiple is negative, it rounds up////////same in javascript?
    static roundDownToNearestMultipleOf(number,multiple){
        var ans = number/multiple;
        ans = Math.floor(ans);
        ans *= multiple;
        return ans;
    }
    //if multiple is negative, it rounds down////////same in javascript?
    static roundUpToNearestMultipleOf(number,multiple){
        var ans = number/multiple;
        ans = Math.ceil(ans);
        ans *= multiple;
        return ans;
    }

    static roundToNearestMultipleOf(number,multiple){
        return MyMath.roundDownToNearestMultipleOf(number+multiple/2,multiple);
    }

    //returns angle from start to end point (-Pi<value<=Pi)
    static findAngleFromTo(xStart,yStart,xEnd,yEnd){
        return Math.atan2(yEnd-yStart,xEnd-xStart);
    }
    //returns angle from (0,0) to the given coordinates (-Pi<value<=Pi)
    static findAngleTo(xEnd,yEnd){
        return Math.atan2(yEnd,xEnd);
    }
    //returns angle from start to end point (0<value<=2Pi)
    static findAngleFromTo02PI(xStart,yStart,xEnd,yEnd){
        let angle = MyMath.findAngleFromTo(xStart,yStart,xEnd,yEnd);
        if(angle<0){
            return angle+Math.PI*2;
        }else{
            return angle;
        }
    }
    //returns angle from (0,0) to the given coordinates (0<value<=2Pi)
    static findAngleTo02PI(xEnd,yEnd){
        let angle = MyMath.findAngleTo(xEnd,yEnd);
        if(angle<0){
            return angle+Math.PI*2;
        }else{
            return angle;
        }
    }

    //returns an equivilant angle (-Pi<value<=Pi)
    static standardizeAngle(angle){
        if(angle<=Math.PI && angle>-Math.PI){
            return angle;
        }else if(angle>Math.PI){
            let changedAngle = angle + Math.PI;
            return -Math.PI+(changedAngle-MyMath.roundDownToNearestMultipleOf(changedAngle,Math.PI*2));
        }else{//angle <=-pi/2
            return -MyMath.standardizeAngle(-angle);
        }
    }

    //text: string of a positive or negative decimal number
    //return: 0 means ones place, 1 means 10's place, -1 means tenths place...
    //if the index refers to the decimal or negative sign, just returns null
    static getPowerValueOfIndex(text,index){
        if(!MyMath.isDigit(text[index])){
            return null;
        }
        //find the decimal. assume only one
        let decIndex = text.indexOf('.');
        if(decIndex==-1){
            decIndex = text.length;//no decimal: must be invisible at end
        }
        

        if(decIndex>index){
            return decIndex-index-1;
        }else{
            return -(index-decIndex);
        }
    }

    static isDigit(char){
        return char>='0'&&char<='9';
    }

    static getDecimalRegex(){//basic number. can have decimals or be negative
        return new RegExp(/-?((\d+\.?\d*)|(\.\d+))/,'g');
    }
    static getPositiveDecimalRegex(){
        return new RegExp(/((\d+\.?\d*)|(\.\d+))/,'g');
    }
    //number in scientific notation at the end using e. can be negative
    //base can be any decimal number, exponent must be a integer
    static getSciNotationRegex(){
        return new RegExp(/-?((\d+\.?\d*)|(\.\d+))(e[+-]\d+)/,'g');
    }
    static getPositiveSciNotationRegex(){
        return new RegExp(/((\d+\.?\d*)|(\.\d+))(e[+-]\d+)/,'g');
    }

    //number that can possibly have scientific notation at the end using e. can be negative
    //base can be any decimal number, exponent must be a integer
    static getNumberRegex(){
        return new RegExp(/-?((\d+\.?\d*)|(\.\d+))(e[+-]\d+)?/,'g');////////////////any exponent:  -?((\d+\.?\d*)|(\.\d+))(e[+-]((\d+\.?\d*)|(\.\d+)))?/
    }
    static getPositiveNumberRegex(){
        return new RegExp(/((\d+\.?\d*)|(\.\d+))(e[+-]\d+)?/,'g');
    }

    



    static getPowerValue(number){
        return Math.floor(Math.log10(Math.abs(number)));
    }

    static roundToPowerValue(number,powerValue){
        let tenPow = Math.pow(10,powerValue);
        return Math.round(number/tenPow)*tenPow;
    }


}

