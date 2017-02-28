declare namespace Kbpgp {
        namespace KeyManager {
                interface Options {
                        userid: string;
                        asp?: ASP;
                }

                function generate_rsa (
                        options: Options,
                        callback: (err: Error, instance: KeyManagerInstance) => void)
                        : void;

                function import_from_armored_pgp (
                        options: { armored: string },
                        callback: (err: Error, instance: KeyManagerInstance) => void)
                        : void;
        }

        interface KeyManagerInstance {
                get_userids: () => { utf8: () => string; }[];
                get_pgp_fingerprint_str: () => string;
                has_pgp_private: () => boolean;
                is_pgp_locked: () => boolean;
                sign: (obj: Object, callback: (err: Error) => void) => void;
                unlock_pgp: (
                        options: { passphrase: string },
                        callback: (err: Error) => void
                        ) => void;
                export_pgp_public: (
                        options: {},
                        callback: (err: Error, publicKey: string) => void
                        ) => void;
                export_pgp_private: (
                        options: { passphrase: string; },
                        callback: (err: Error, privateKey: string) => void
                        ) => void;
        }

        namespace keyring {
                class KeyRing {
                        add_key_manager(instance: KeyManagerInstance): void;
                }
        }

        interface Progress {
                what: string;
                p?: number;
                i?: number;
                total?: number;
        }

        class ASP {
                constructor(opts: { progress_hook: (info: Progress) => void; });
        }

        function box (
                params: {
                        msg: string,
                        encrypt_for: KeyManagerInstance,
                        // sign_with: KeyManagerInstance
                },
                callback: (err: Error, result: string) => void)
                : void;

        interface Literal {
                toString: () => string;
                get_data_signer:
                        () => { get_key_manager: () => KeyManagerInstance };
        }

        function unbox (
                params: {
                        keyfetch: keyring.KeyRing | KeyManagerInstance,
                        armored: string,
                },
                callback: (err: Error, literals: Literal[]) => void)
                : void;

        type Error = string;
}

declare module "kbpgp" {
        export = Kbpgp;
}
