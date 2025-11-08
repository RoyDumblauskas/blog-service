{
  description = "Flake to build TS React App and run as a systemd service";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};

    reactApp = pkgs.buildNpmPackage {
      name = "React Frontend";
      version = "0.1.0";
      src = "./.";

      npmDepsHash = "";

      # TODO: Configure npm building of frontend

    };

    nixosModule = {config, lib, pkgs, ...}:
      let opts = config.services.blog-service; in
    {
      enableFrontend = lib.mkEnableOption "Enable Frontend of blog";

      port = lib.mkOption {
        type = lib.types.port;
        description = "Port to host frontend";
      };

      credentialsFile = lib.mkOption {
        type = lib.types.path;
        description = "File containing secret environment variables";
      };

      default-nginx = {
        enableNginx = lib.mkEnableOption "Enable nginx reverse proxy";
        domainName = lib.mkOption {
          type = lib.types.string;
          description = "Domain name to host service";
        };
      };

      config = lib.mkIf opts.enableFrontend {
        systemd.services.blog-service = {
          description = "Frontend of self-hosted blog";
          wantedby = ["multi-user.target"];
          after = ["network.target"];

          environment = {
            PORT = toString opts.port;
          };

          serviceConfig = {
            ExecStart = "${reactApp}/bin/blog-service";
            Restart = "always";
            Type = "simple";
            DynamicUser = "yes";
            WorkingDirectory = "${reactApp}";
            EnvironmentFile = "${opts.credentialsFile}";
          };
        };

        services.nginx = lib.mkIf opts.default-nginx.enableNginx {
          enable = true;
          virtualHosts."${opts.default-nginx.domainName}" = {
            forceSSL = true;
            useACMEHost = let
              b = builtins;
              s = lib.strings;
              fl = s.splitString "." "${opts.default-nginx.domainName}";
                in b.concatStringsSep "." [ (b.elemAt fl (b.length fl - 2)) (b.elemAt fl (b.length fl - 1)) ];
            
            locations."/" = {
              proxyPass = "http://localhost:${toString opts.port}";
            };
          };
        };

        networking.firewall.allowedTCPPorts = lib.mkMerge [
          (lib.mkIf opts.enableFrontend [ opts.port ])
          (lib.mkIf opts.default-nginx.enableNginx [ 80 443 ])
        ];
      };
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
