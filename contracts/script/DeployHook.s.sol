// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HopYieldHook} from "../src/HopYieldHook.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";

contract DeployHook is Script {
    // Base Sepolia PoolManager (Uniswap V4)
    address constant POOL_MANAGER = 0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408;

    // Hook flags: beforeAddLiquidity (bit 11) + afterRemoveLiquidity (bit 8)
    uint160 constant FLAG_MASK = uint160(Hooks.BEFORE_ADD_LIQUIDITY_FLAG | Hooks.AFTER_REMOVE_LIQUIDITY_FLAG);

    function run() public {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        console.log("Deployer:", deployer);
        console.log("Required flag mask: %x", uint256(FLAG_MASK));

        // Mine a CREATE2 salt that produces an address with the correct hook flags
        bytes memory creationCode = abi.encodePacked(
            type(HopYieldHook).creationCode,
            abi.encode(IPoolManager(POOL_MANAGER))
        );
        bytes32 initCodeHash = keccak256(creationCode);

        console.log("Mining salt for correct hook address...");

        bytes32 salt;
        address hookAddress;
        for (uint256 i = 0; i < 100000; i++) {
            salt = bytes32(i);
            hookAddress = vm.computeCreate2Address(salt, initCodeHash, CREATE2_FACTORY);

            // Check that required flag bits are set AND no other hook bits are set
            uint160 addressFlags = uint160(hookAddress) & uint160(Hooks.ALL_HOOK_MASK);
            if (addressFlags == FLAG_MASK) {
                console.log("Found valid salt at iteration:", i);
                break;
            }

            if (i == 99999) {
                revert("Could not find valid salt in 100000 iterations");
            }
        }

        console.log("Hook address:", hookAddress);

        vm.startBroadcast(deployerKey);
        HopYieldHook hook = new HopYieldHook{salt: salt}(IPoolManager(POOL_MANAGER));
        vm.stopBroadcast();

        require(address(hook) == hookAddress, "Deployed address mismatch");
        console.log("HopYieldHook deployed at:", address(hook));
    }
}
