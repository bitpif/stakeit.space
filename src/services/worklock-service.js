import Web3 from "web3";
import { WORKLOCK_ADDRESS, WORKLOCK_ABI } from "../ethereum/instances/worklock";

const web3 = new Web3(window.ethereum);

const instanceWorklock = new web3.eth.Contract(WORKLOCK_ABI, WORKLOCK_ADDRESS);

////   WORKLOCK
////   WORKLOCK
////   WORKLOCK

export default class WorklockService {
  _convertMS(milliseconds) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds
    };
  }

  async getWorklockData() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    // TIME START
    // Start bid day
    const startBidDate = await instanceWorklock.methods.startBidDate().call();
    const biddingStartDateHuman = new Date(startBidDate * 1000).toUTCString();

    // End bid day
    const endBidDate = await instanceWorklock.methods.endBidDate().call();
    const biddingEndDateHuman = new Date(endBidDate * 1000).toUTCString();
    const biddingDurationMs = (endBidDate - startBidDate) * 1000;

    // Calculate bidding duration
    const objA = this._convertMS(biddingDurationMs);
    const biddingDuration = `${objA.day} days, ${objA.hour} hour, ${objA.minute} min`;

    // Calculate bidding remaining
    const currentDateUnix = Date.now();
    const biddingTimeRemainingMs = endBidDate * 1000 - currentDateUnix;
    const objB = this._convertMS(biddingTimeRemainingMs);
    const biddingTimeRemaining = `${objB.day} days, ${objB.hour} hour, ${objB.minute} min`;

    // Cancellation Window End Date
    const cancellationEndDate = await instanceWorklock.methods
      .endCancellationDate()
      .call();
    const endCancellationDateHuman = new Date(
      cancellationEndDate * 1000
    ).toUTCString();

    // Calculate Cancellation Window Duration
    const cancellationTimeDuration = cancellationEndDate - startBidDate;
    const objD = this._convertMS(cancellationTimeDuration * 1000);
    const cancellationTimeDurationHuman = `${objD.day} D, ${objD.hour} H, ${objD.minute} M`;

    // Calculate Cancellation Window Time Remaining
    const remainingCancelationTime = cancellationEndDate * 1000 - currentDateUnix;
    const objC = this._convertMS(remainingCancelationTime);
    const remainingCancelationTimeHuman = `${objC.day} D, ${objC.hour} H, ${objC.minute} M`;
    // TIME END

    // Claiming phase open?
    const isClaimingAvailable = await instanceWorklock.methods
    .isClaimingAvailable()
    .call();
    let isClaimingAvailableHuman;
      if (isClaimingAvailable) {
        isClaimingAvailableHuman = "Yes";
      } else {
        isClaimingAvailableHuman = "No";
      }
    // ECONOMICS
    
    // min allowed bid minAllowedBid
    const minAllowedBid = await instanceWorklock.methods
      .minAllowedBid()
      .call();
    const minAllowedBidETH = parseFloat(
      web3.utils.fromWei(minAllowedBid, "ether")
    ).toFixed(2);

    // Bidders count
    const getBiddersLength = await instanceWorklock.methods
      .getBiddersLength()
      .call();
    
      // get current bid
    const workInfo = await instanceWorklock.methods.workInfo(account).call();
    const currentBid = web3.utils.fromWei(workInfo[0], "ether");
    // get completedWork
    const completedWork = workInfo[1];
    // is tokens claimed ?
    const claimed = workInfo[2];
    
    // current nu allocations
    const ethToTokensNits = await instanceWorklock.methods
      .ethToTokens(workInfo[0])
      .call()
    const ethToTokensNu = ethToTokensNits / 10**18
    // boostingRefund
    const boostingRefund = await instanceWorklock.methods
      .boostingRefund()
      .call()
    //  SLOWING_REFUND
    const SLOWING_REFUND = await instanceWorklock.methods
      .SLOWING_REFUND()
      .call()
    // getAvailableRefund
    const getAvailableRefund = await instanceWorklock.methods
      .getAvailableRefund(account)
      .call()


    const worklockData = {
      account: account,
      biddersLength: getBiddersLength,
      // time start
      biddingStartDate: biddingStartDateHuman,
      biddingEndDate: biddingEndDateHuman,
      biddingDuration: biddingDuration,
      biddingTimeRemaining: biddingTimeRemaining,
      cancellationEndDate: endCancellationDateHuman,
      cancellationTimeDuration: cancellationTimeDurationHuman,
      cancellationTimeRemaining: remainingCancelationTimeHuman,
      // time end
      claimingBool: isClaimingAvailable,
      claimingYesNo: isClaimingAvailableHuman,
      //
      // Economics
      minAllowedBid: minAllowedBidETH,
      workInfo: workInfo,
      completedWork: completedWork,
      claimed: claimed,
      currentBid: currentBid,
      tokensAllocated: ethToTokensNu,
      boostingRefund: boostingRefund,
      SLOWING_REFUND: SLOWING_REFUND,
      аvailableRefund: getAvailableRefund,

      methods: instanceWorklock.methods

    };
    return worklockData;
  }
}

/**

async blabla() {
    
    
  // cancel bin date
  const endCancellationDate = await instanceWorklock.methods
    .endCancellationDate()
    .call();
  const endCancellationDateHuman = new Date(
    endCancellationDate * 1000
  ).toUTCString();
  const currentDateUnix = Date.now();
  const remainingCancelationTime =
    endCancellationDate * 1000 - currentDateUnix;

  function convertMS(milliseconds) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds
    };
  }
  const dateObj = convertMS(remainingCancelationTime);
  const remainingCancelationTimeHuman = `${dateObj.day} days, ${dateObj.hour} hours, ${dateObj.minute} minutes`;
  // console.log(remainingCancelationTimeHuman);

  // const humanDateFormat = dateObject.toLocaleString()
  const isClaimingAvailable = await instanceWorklock.methods
    .isClaimingAvailable()
    .call();


  //getting balance
  const worklockBal = await web3.eth.getBalance(
    instanceWorklock.options.address
  );
  const worklockBalETH = parseFloat(
    web3.utils.fromWei(worklockBal, "ether")
  ).toFixed(2);
  

  const getRemainingWork = await instanceWorklock.methods
    .getRemainingWork(address)
    .call();
  // get current bid
  const workInfo = await instanceWorklock.methods.workInfo(address).call();
  const currentBid = web3.utils.fromWei(workInfo[0], "ether");
  // console.log(instanceWorklock.methods);
  // console.log(getRemainingWork);
  // console.log(workInfo2);

  let isClaimingAvailableHuman;
  if (isClaimingAvailable) {
    isClaimingAvailableHuman = "Yes";
  } else {
    isClaimingAvailableHuman = "No";
  }

  // console.log(instanceWorklock.methods);
  // console.log(isClaimingAvailable);
  this.setState({
    address,
    getBiddersLength,
    startBidDateHuman,
    endBidDateHuman,
    isClaimingAvailableHuman,
    worklockBalETH,
    minAllowedBidETH,
    currentBid,
    endCancellationDateHuman,
    remainingCancelationTimeHuman
  });
}

makeBid = async e => {
  e.preventDefault();
  console.log("blabla");
  const accounts = await web3.eth.getAccounts();
  console.log(this.state.inputAmount);
  const toNum = +this.state.inputAmount;

  await instanceWorklock.methods.bid().send({
    from: accounts[0],
    value: web3.utils.toWei(this.state.inputAmount, "ether")
  });
};

cancelBid = async e => {
  e.preventDefault();
  const accounts = await web3.eth.getAccounts();
  await instanceWorklock.methods.cancelBid().send({
    from: accounts[0]
  });
};
**/
