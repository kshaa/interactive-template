terragrunt = {
  remote_state {
    backend = "s3"

    config {
      profile        = "user"
      region         = "eu-west-2"
      # Profile appended in remote_state s3 bucket name, because s3 bucket names must be unique
      # and sometimes the project code isn't unique, but in combination w/ profile, it will be
      bucket         = "user-eu-west-2-tfstate"
      key            = "${path_relative_to_include()}/terraform.tfstate"
      encrypt        = true
      dynamodb_table = "test-terraform-lock"
    }
  }

  # Include all settings from the root terraform.tfvars file
  include = {
    path = "${find_in_parent_folders()}"
  }
}