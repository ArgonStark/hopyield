// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseTestHooks} from "@uniswap/v4-core/src/test/BaseTestHooks.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {BalanceDelta, toBalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";

/// @title HopYieldHook
/// @notice Uniswap V4 hook that tracks LP positions for cross-chain yield optimization
contract HopYieldHook is BaseTestHooks {
    using PoolIdLibrary for PoolKey;

    struct Position {
        int256 liquidity;
        int24 tickLower;
        int24 tickUpper;
        uint256 openedAt;
    }

    // Events
    event PositionOpened(
        address indexed provider,
        PoolId indexed poolId,
        int256 liquidity,
        int24 tickLower,
        int24 tickUpper
    );

    event PositionClosed(
        address indexed provider,
        PoolId indexed poolId,
        int256 liquidity
    );

    // Storage
    IPoolManager public immutable POOL_MANAGER;

    // user => poolId => position
    mapping(address => mapping(PoolId => Position)) public positions;

    constructor(IPoolManager _poolManager) {
        POOL_MANAGER = _poolManager;
    }

    function getHookPermissions() public pure returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: true,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: true,
            beforeSwap: false,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function beforeAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata
    ) external override returns (bytes4) {
        PoolId poolId = key.toId();

        positions[sender][poolId] = Position({
            liquidity: params.liquidityDelta,
            tickLower: params.tickLower,
            tickUpper: params.tickUpper,
            openedAt: block.timestamp
        });

        emit PositionOpened(
            sender,
            poolId,
            params.liquidityDelta,
            params.tickLower,
            params.tickUpper
        );

        return IHooks.beforeAddLiquidity.selector;
    }

    function afterRemoveLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) external override returns (bytes4, BalanceDelta) {
        PoolId poolId = key.toId();

        emit PositionClosed(
            sender,
            poolId,
            params.liquidityDelta
        );

        delete positions[sender][poolId];

        return (IHooks.afterRemoveLiquidity.selector, toBalanceDelta(0, 0));
    }

    function getPosition(address user, PoolId poolId) external view returns (Position memory) {
        return positions[user][poolId];
    }
}
