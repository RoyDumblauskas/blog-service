{
  description = "Flake to build TS React App and run as a systemd service";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};

    reactApp = pkgs.buildNpmPackage {
      name = "react frontend";
      version = "0.1.0";

      # TODO: Configure npm building of frontend

    };

    nixosModule = {config, lib, pkgs, ...}:
      let opts = config.services.blog-service; in
    {
      # TODO: Write out options for frontend service (port hosting, nginx, backend ports?)
    };

  in {
    packages.${system}.default = reactApp;
    
    apps.${system}.default = {
      type = "app";
      program = "${self.packages.${system}.default}/bin/blog-service";
    };
    
    nixosModules.${system}.default = nixosModule;

  };
}
