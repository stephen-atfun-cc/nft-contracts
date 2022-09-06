// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract NFTBox is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {
    constructor() ERC1155("https://mate.atfun.cc/api/item/{id}.json") {}

    // 设置藏品mate信息的地址
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // 暂停项目
    function pause() public onlyOwner {
        _pause();
    }
    // 重启项目
    function unpause() public onlyOwner {
        _unpause();
    }
    // 管理员转移藏品，解决BSN DDC给用户充值gas问题
    function transferByOwner(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual onlyOwner {
        _safeTransferFrom(from, to, id, amount, data);
    }
    // 批量转移藏品
    /**
     * @dev See {IERC1155-safeBatchTransferFrom}.
     */
    function batchTransferByOwner(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual onlyOwner {
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    // 铸造藏品
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }
    // 批量铸造藏品
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
    // 转移藏品回调
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
