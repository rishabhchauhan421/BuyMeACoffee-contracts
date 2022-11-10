//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

contract BuyMeACoffee{

    //event to emit when a memo is created
    event newMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo Struc.
    struct Memo{
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of all memos received
    Memo[] memos;

    //address of contract deployer;
    address payable owner;

    //Deploy logic
    constructor(){
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a message from the coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message) public payable  {
        require(msg.value>0, "can't buy coffee with 0eth");

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        //Emit a log event when memo is created
        emit newMemo (msg.sender, block.timestamp, _name, _message);

    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));

    }


    /**
     * @dev retrieve all the memos received and stored on the blockchain
     */
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }

}
