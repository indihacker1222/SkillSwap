# EduVerse

## Project Front Page

Here is a preview of the project's front page:

![Project Front Page](client/src/assets/EduVerseFrontImage.png)

---

## Introduction

The EduVerse is a decentralized platform designed for buying, selling, and listing educational resources. Built on EDU Chain, it allows users to tokenize learning materials, such as eBooks or courses, and trade them securely using NFTs. The marketplace offers transparency, ownership, and monetization opportunities for educational creators and learners alike.

---

## Features

- **Listing Educational Resources:**
  - Users can mint and list their educational resources as NFTs with metadata such as name, description, and URI.
  - A listing fee of `0.01 EDU` applies to publish resources.

- **Purchasing Resources:**
  - Buyers can purchase listed educational resources by paying the listed price.
  - Ownership is transferred securely on the blockchain.

- **Reselling Resources:**
  - Owners can resell purchased resources by listing them back on the marketplace.

- **Viewing Resources:**
  - Users can browse all listed resources, view specific resource details, or retrieve their owned/sold resources.

- **Fee Management:**
  - The owner of the contract can update the listing price and withdraw accumulated fees.

---

## Contract Details

### Variables

- **Owner Address:** The address of the contract deployer.
- **List Price:** The fee required to list an educational resource (default: `0.01 ether`).
- **Course Counters:**
  - `_courseIds`: Tracks the total number of courses created.
  - `_itemsSold`: Tracks the number of resources sold.

### Structures

- **ListedCourse:**
  - `courseId`: Unique ID of the resource.
  - `owner`: Current owner of the resource.
  - `seller`: Original lister of the resource.
  - `price`: Price of the resource.
  - `currentlyListed`: Boolean indicating whether the resource is listed.
  - `courseURI`: URI of the resource (e.g., eBook link).
  - `name`: Name of the resource.
  - `description`: Description of the resource.

### Functions

#### User Functions

- `createCourse(string courseName, string courseURI, uint256 price, string courseDescription)`:
  - Mint and list an educational resource.
  - Requires a listing fee and a positive price.
  
- `executeSale(uint256 courseId)`:
  - Purchase a listed resource.
  - Transfers ownership and pays the seller.

- `resellCourse(uint256 courseId, uint256 price)`:
  - Relist a purchased resource for resale.

- `getAllCourses()`:
  - Retrieve all listed educational resources.

- `getMyCourses(address userAddress)`:
  - Retrieve resources owned or sold by a specific user.

- `getDescriptionForCourseId(uint256 courseId)`:
  - View the description of a specific resource.

#### Admin Functions

- `updateListPrice(uint256 _listPrice)`:
  - Update the fee required to list resources.

- `withdraw()`:
  - Withdraw accumulated fees from the contract.

### Utility Functions

- `getListPrice()`:
  - Retrieve the current listing fee.

- `getLatestListedCourse()`:
  - Retrieve details of the most recently listed resource.

- `getListedForCourseId(uint256 courseId)`:
  - Retrieve details of a specific listed resource.

---

## Usage Instructions

### Deployment

1. Deploy the `EducationMarketPlace` contract on a supported EDU Chain.
2. Initialize the contract with the desired owner address.

### Listing a Resource

1. Call `createCourse()` with the resource name, URI, price, and description.
2. Ensure to send the listing fee (`0.01 ether`) with the transaction.
3. The resource will be minted and listed on the marketplace.

### Purchasing a Resource

1. Call `executeSale()` with the resource ID.
2. Pay the exact price of the resource to complete the purchase.
3. Ownership of the resource will be transferred.

### Reselling a Resource

1. Call `resellCourse()` with the resource ID and desired price.
2. Ensure you are the owner of the resource.
3. The resource will be listed back on the marketplace.

### Withdrawing Fees

1. Only the contract owner can call `withdraw()` to transfer accumulated fees to their address.

---

## Events

- `CourseCreated(uint256 indexed courseId, address indexed seller, uint256 price, string courseURI)`
- `CourseSold(uint256 indexed courseId, address indexed buyer, uint256 price)`
- `CourseRelisted(uint256 indexed courseId, address indexed seller, uint256 price)`
- `ListPriceUpdated(uint256 newListPrice)`

---

## Security Considerations

- **Reentrancy Protection:** The contract uses OpenZeppelin's `ReentrancyGuard` to prevent reentrancy attacks.
- **Fee Handling:** Ensure listing fees are appropriately managed.
- **Ownership Verification:** Only owners can resell or withdraw funds.
- **Auditing:** Conduct a security audit before deployment.

---

## License

This project is licensed under the MIT License.

---

## Links

- **GitHub Repository:** [Education Marketplace](https://github.com/Anish99594/EduVerse.git)
- **Demo Video:** [Watch Here](https://drive.google.com/file/d/1zgSQ8CjgKX6tzTYULpat95o-3GXQkB0k/view?usp=sharing)
- **Project Website:** [Visit Here](https://edu-verse-two.vercel.app/)
