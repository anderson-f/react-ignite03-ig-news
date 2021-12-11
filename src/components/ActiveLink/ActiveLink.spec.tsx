import { render } from "@testing-library/react";
import React from "react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

describe('ActiveLink component', () => {
  it("should renders correctly", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(getByText('Home')).toBeInTheDocument()
  });

  it("should adds active class if the link as currently active", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(getByText('Home')).toBeInTheDocument()
  });

})

